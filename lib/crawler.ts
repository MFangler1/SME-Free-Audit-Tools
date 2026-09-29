import * as cheerio from 'cheerio';
import robotsParser from 'robots-parser';

export interface CrawledPage {
  url: string;
  title: string;
  metaDescription: string;
  h1: string[];
  h2: string[];
  h3: string[];
  bodyText: string;
  jsonLd: object[];
  links: string[];
}

export interface CrawlResult {
  pages: CrawledPage[];
  errors: string[];
  totalPagesFound: number;
  totalPagesCrawled: number;
}

const MAX_PAGES = 15;
const REQUEST_TIMEOUT = 10000;
const RATE_LIMIT_DELAY = 500;

const PRIORITY_PATHS = [
  '/',
  '/about',
  '/about-us',
  '/services',
  '/products',
  '/contact',
  '/contact-us',
  '/faq',
  '/faqs',
  '/team',
  '/pricing',
  '/blog',
  '/case-studies',
  '/testimonials',
  '/reviews',
  '/portfolio',
];

async function fetchWithTimeout(url: string, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AiConsultancy-AuditBot/1.0 (https://aiconsultancy.org.uk)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function checkRobotsTxt(baseUrl: string): Promise<{ allowed: boolean; robotsUrl: string }> {
  try {
    const robotsUrl = new URL('/robots.txt', baseUrl).href;
    const response = await fetchWithTimeout(robotsUrl, 5000);
    
    if (response.ok) {
      const robotsText = await response.text();
      const robots = robotsParser(robotsUrl, robotsText);
      const allowed = robots.isAllowed(baseUrl, 'AiConsultancy-AuditBot') !== false;
      return { allowed, robotsUrl };
    }
    return { allowed: true, robotsUrl };
  } catch {
    return { allowed: true, robotsUrl: '' };
  }
}

function extractJsonLd(html: string): object[] {
  const $ = cheerio.load(html);
  const jsonLdScripts: object[] = [];
  
  $('script[type="application/ld+json"]').each((_, element) => {
    try {
      const content = $(element).html();
      if (content) {
        const parsed = JSON.parse(content);
        jsonLdScripts.push(parsed);
      }
    } catch {
      // Skip invalid JSON-LD
    }
  });
  
  return jsonLdScripts;
}

function extractPageData(url: string, html: string): CrawledPage {
  const $ = cheerio.load(html);
  
  $('script, style, noscript, nav, footer, header').remove();
  
  const title = $('title').first().text()?.trim() || '';
  const metaDescription = $('meta[name="description"]').attr('content')?.trim() || '';
  
  const h1: string[] = [];
  const h2: string[] = [];
  const h3: string[] = [];
  
  $('h1').each((_, el) => {
    const text = $(el).text()?.trim();
    if (text) h1.push(text);
  });
  
  $('h2').each((_, el) => {
    const text = $(el).text()?.trim();
    if (text) h2.push(text.substring(0, 200));
  });
  
  $('h3').each((_, el) => {
    const text = $(el).text()?.trim();
    if (text) h3.push(text.substring(0, 200));
  });
  
  let bodyText = $('body').text() || '';
  bodyText = bodyText
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000);
  
  const links: string[] = [];
  const baseUrl = new URL(url).origin;
  
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href');
    if (!href) return;
    
    try {
      let fullUrl: string;
      if (href.startsWith('http')) {
        fullUrl = href;
      } else if (href.startsWith('/')) {
        fullUrl = baseUrl + href;
      } else {
        return;
      }
      
      const parsedUrl = new URL(fullUrl);
      if (parsedUrl.origin === baseUrl && !links.includes(fullUrl)) {
        const cleanUrl = `${parsedUrl.origin}${parsedUrl.pathname}`;
        if (!links.includes(cleanUrl)) {
          links.push(cleanUrl);
        }
      }
    } catch {
      // Skip invalid URLs
    }
  });
  
  const jsonLd = extractJsonLd(html);
  
  return {
    url,
    title,
    metaDescription,
    h1,
    h2,
    h3,
    bodyText,
    jsonLd,
    links,
  };
}

async function crawlPage(url: string): Promise<CrawledPage | null> {
  try {
    const response = await fetchWithTimeout(url, REQUEST_TIMEOUT);
    
    if (!response.ok) {
      return null;
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html')) {
      return null;
    }
    
    const html = await response.text();
    return extractPageData(url, html);
  } catch (error) {
    console.error(`Failed to crawl ${url}:`, error);
    return null;
  }
}

export async function crawlWebsite(
  startUrl: string,
  onProgress?: (message: string, progress: number) => void
): Promise<CrawlResult> {
  const pages: CrawledPage[] = [];
  const errors: string[] = [];
  const crawledUrls = new Set<string>();
  const urlsToCrawl: string[] = [];
  
  let baseUrl: string;
  try {
    const parsed = new URL(startUrl);
    baseUrl = parsed.origin;
    urlsToCrawl.push(parsed.href);
  } catch {
    errors.push('Invalid URL format');
    return { pages, errors, totalPagesFound: 0, totalPagesCrawled: 0 };
  }
  
  onProgress?.('Checking robots.txt...', 5);
  const { allowed } = await checkRobotsTxt(baseUrl);
  
  if (!allowed) {
    errors.push('Website robots.txt blocks crawling');
    return { pages, errors, totalPagesFound: 0, totalPagesCrawled: 0 };
  }
  
  for (const path of PRIORITY_PATHS) {
    const fullUrl = `${baseUrl}${path}`;
    if (!urlsToCrawl.includes(fullUrl)) {
      urlsToCrawl.push(fullUrl);
    }
  }
  
  while (urlsToCrawl.length > 0 && pages.length < MAX_PAGES) {
    const url = urlsToCrawl.shift()!;
    
    const normalizedUrl = url.replace(/\/$/, '');
    if (crawledUrls.has(normalizedUrl)) continue;
    crawledUrls.add(normalizedUrl);
    
    const progress = Math.min(10 + (pages.length / MAX_PAGES) * 40, 50);
    onProgress?.(`Crawling ${new URL(url).pathname}...`, progress);
    
    const pageData = await crawlPage(url);
    
    if (pageData) {
      pages.push(pageData);
      
      for (const link of pageData.links) {
        const normalizedLink = link.replace(/\/$/, '');
        if (!crawledUrls.has(normalizedLink) && !urlsToCrawl.includes(link)) {
          urlsToCrawl.push(link);
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  }
  
  if (pages.length === 0) {
    errors.push('Could not crawl any pages from the website');
  }
  
  return {
    pages,
    errors,
    totalPagesFound: crawledUrls.size,
    totalPagesCrawled: pages.length,
  };
}

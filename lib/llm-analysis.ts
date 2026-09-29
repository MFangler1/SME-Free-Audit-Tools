export interface AnalysisResult {
  ai_description: string;
  confidence_level: 'High' | 'Medium' | 'Low';
  facts_found: {
    who: string;
    what: string;
    where: string;
    why: string;
    proof: string;
  };
  gaps: string[];
  schema_status: {
    types_present: string[];
    types_missing: string[];
    errors: string[];
  };
  content_gaps: string[];
  score: number;
  score_reasoning: string;
}

import type { CrawledPage } from './crawler';

function prepareCrawlDataForPrompt(pages: CrawledPage[]): string {
  let content = '';
  
  for (const page of pages.slice(0, 10)) {
    content += `\n\n--- PAGE: ${page.url} ---\n`;
    content += `Title: ${page.title}\n`;
    content += `Meta Description: ${page.metaDescription}\n`;
    
    if (page.h1.length > 0) content += `H1 Headings: ${page.h1.join(' | ')}\n`;
    if (page.h2.length > 0) content += `H2 Headings: ${page.h2.slice(0, 5).join(' | ')}\n`;
    if (page.h3.length > 0) content += `H3 Headings: ${page.h3.slice(0, 5).join(' | ')}\n`;
    
    const truncatedBody = page.bodyText.substring(0, 2000);
    content += `Body Content: ${truncatedBody}\n`;
    
    if (page.jsonLd.length > 0) {
      content += `JSON-LD Schema: ${JSON.stringify(page.jsonLd).substring(0, 1000)}\n`;
    }
  }
  
  return content.substring(0, 25000);
}

export async function analyzeWithLLM(
  pages: CrawledPage[],
  businessNameOverride?: string
): Promise<AnalysisResult> {
  const crawlContent = prepareCrawlDataForPrompt(pages);
  
  const prompt = `You are an AI visibility expert analyzing a business website to determine how visible and accurately represented it is in AI-driven search systems like ChatGPT, Perplexity, Claude, and Google AI Overviews.

${businessNameOverride ? `Business Name (provided by user): ${businessNameOverride}\n` : ''}

SCRAPED WEBSITE CONTENT:
${crawlContent}

ANALYZE this website and provide a comprehensive assessment. Consider:
1. How well can an AI system understand WHAT this business does?
2. Can AI determine WHO they serve (target audience)?
3. Is their service area/location (WHERE) clear?
4. What makes them different (WHY choose them)?
5. Is there PROOF of credibility (reviews, case studies, credentials)?
6. What structured data (JSON-LD/schema) is present or missing?
7. Is there FAQ content that AI can use to answer questions?

Provide your analysis in this exact JSON format:
{
  "ai_description": "2-3 sentence description of how an AI would currently describe this business based on the website content",
  "confidence_level": "High" or "Medium" or "Low",
  "facts_found": {
    "who": "target audience/customers found on site, or empty string if unclear",
    "what": "services/products offered, or empty string if unclear",
    "where": "location/service area, or empty string if unclear",
    "why": "value proposition/differentiators, or empty string if unclear",
    "proof": "case studies/reviews/credentials found, or empty string if none"
  },
  "gaps": ["list of 5-8 specific issues that make this business less visible to AI - be specific to THIS website, not generic advice"],
  "schema_status": {
    "types_present": ["list of schema.org types detected"],
    "types_missing": ["critical schema types that should be added: Organization/LocalBusiness, FAQPage, Service, Article, etc."],
    "errors": ["any schema implementation issues found"]
  },
  "content_gaps": ["specific content that's missing: FAQs, clear service descriptions, team info, case studies, etc."],
  "score": 0-100 integer representing AI discoverability,
  "score_reasoning": "One sentence explaining the score"
}

SCORING GUIDELINES:
- 80-100: Excellent AI visibility
- 60-79: Good visibility with room for improvement
- 40-59: Moderate visibility
- 20-39: Poor visibility
- 0-19: Very poor

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.`;

  const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI visibility expert. Always respond with valid JSON only, no markdown or code blocks.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  
  try {
    const result = JSON.parse(content);
    
    return {
      ai_description: result.ai_description || 'Unable to generate description',
      confidence_level: ['High', 'Medium', 'Low'].includes(result.confidence_level) 
        ? result.confidence_level 
        : 'Low',
      facts_found: {
        who: result.facts_found?.who || '',
        what: result.facts_found?.what || '',
        where: result.facts_found?.where || '',
        why: result.facts_found?.why || '',
        proof: result.facts_found?.proof || '',
      },
      gaps: Array.isArray(result.gaps) ? result.gaps.slice(0, 8) : [],
      schema_status: {
        types_present: Array.isArray(result.schema_status?.types_present) 
          ? result.schema_status.types_present : [],
        types_missing: Array.isArray(result.schema_status?.types_missing) 
          ? result.schema_status.types_missing : [],
        errors: Array.isArray(result.schema_status?.errors) 
          ? result.schema_status.errors : [],
      },
      content_gaps: Array.isArray(result.content_gaps) ? result.content_gaps : [],
      score: typeof result.score === 'number' 
        ? Math.max(0, Math.min(100, Math.round(result.score))) : 25,
      score_reasoning: result.score_reasoning || 'Score based on overall AI visibility assessment',
    };
  } catch (parseError) {
    console.error('Failed to parse LLM response:', content);
    throw new Error('Failed to parse analysis results');
  }
}

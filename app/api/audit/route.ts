import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { crawlWebsite } from '@/lib/crawler';
import { analyzeWithLLM } from '@/lib/llm-analysis';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface AuditRequestBody {
  url: string;
  email: string;
  contactName?: string;
  businessName?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

async function sendAdminNotification(auditData: {
  id?: string;
  url: string;
  email: string;
  contactName?: string;
  businessName?: string;
  score?: number;
}) {
  try {
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const appName = 'AI Visibility Audit';
    const reportUrl = auditData.id ? `${appUrl}/report/${auditData.id}` : appUrl;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #008080; border-bottom: 2px solid #008080; padding-bottom: 10px;">
          New AI Visibility Audit Submitted
        </h2>
        <div style="background: #f0fdfa; padding: 24px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0D9488;">
          ${auditData.businessName ? `<p style="margin: 0 0 6px; font-size: 22px; font-weight: bold; color: #0F766E;">${auditData.businessName}</p>` : ''}
          ${auditData.contactName ? `<p style="margin: 0 0 6px; font-size: 18px; font-weight: bold; color: #1F2937;">${auditData.contactName}</p>` : ''}
          <p style="margin: 0; font-size: 18px; font-weight: bold; color: #1F2937;"><a href="mailto:${auditData.email}" style="color: #0D9488; text-decoration: none;">${auditData.email}</a></p>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${reportUrl}" style="background: #0D9488; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">View This Client's Report</a>
        </div>
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Website URL:</strong> <a href="${auditData.url}">${auditData.url}</a></p>
          ${auditData.score !== undefined ? `<p style="margin: 10px 0;"><strong>AI Visibility Score:</strong> ${auditData.score}/100</p>` : ''}
        </div>
        <p style="color: #666; font-size: 12px;">
          Submitted at: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}
        </p>
      </div>
    `;

    await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_NEW_AUDIT_SUBMISSION,
        subject: `New Audit: ${auditData.url}`,
        body: htmlBody,
        is_html: true,
        recipient_email: 'mark.fenty@gmail.com',
        sender_email: `noreply@${new URL(appUrl).hostname}`,
        sender_alias: appName,
      }),
    });
  } catch (error) {
    console.error('Failed to send admin notification:', error);
  }
}

async function sendVisitorConfirmation(data: {
  email: string;
  url: string;
  businessName?: string;
  score: number;
  aiDescription?: string;
}) {
  try {
    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const discountDeadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937;">
        <h2 style="color: #0D9488; border-bottom: 2px solid #0D9488; padding-bottom: 10px;">
          Your Free AI Visibility Snapshot is ready
        </h2>
        <p style="font-size: 16px;">Hi${data.businessName ? ` ${data.businessName}` : ''}, thanks for running a free snapshot for <a href="${data.url}" style="color: #0D9488;">${data.url}</a>.</p>

        <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0D9488; text-align: center;">
          <p style="margin: 0; color: #0F766E; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your AI Discoverability Score</p>
          <p style="margin: 8px 0 0; color: #0D9488; font-size: 48px; font-weight: bold;">${data.score}<span style="font-size: 22px; color: #0F766E;">/100</span></p>
        </div>

        ${data.aiDescription ? `<div style="background: #f9fafb; padding: 16px; border-radius: 8px; margin: 20px 0;"><p style="margin: 0; font-size: 14px;"><strong>How AI currently sees you:</strong><br/>${data.aiDescription}</p></div>` : ''}

        <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <h3 style="margin-top: 0; color: #92400e;">Ready to fix what's holding you back?</h3>
          <p style="margin: 10px 0; color: #92400e;">The <strong>Full AI Visibility Action Plan</strong> gives you a detailed analysis, a Google Analytics baseline, ROI projection, a structured data guide, and a content roadmap — with DIY or done-for-you implementation options.</p>
          <p style="margin: 10px 0; color: #92400e;"><strong>£197</strong> standard — or <strong>£138 (30% off)</strong> if you order by <strong>${discountDeadline}</strong>.</p>
          <p style="margin: 16px 0 0;"><a href="${appUrl}" style="background: #0D9488; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Get My Full Action Plan</a></p>
        </div>

        <p style="color: #6b7280; font-size: 13px;">Questions? Just reply to this email or contact Mark Fenty at Support@AiConsultancy.org.uk.</p>
      </div>
    `;

    await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_FREE_SNAPSHOT_CONFIRMATION,
        subject: `Your AI Visibility Snapshot: ${data.score}/100 for ${data.businessName || data.url}`,
        body: htmlBody,
        is_html: true,
        recipient_email: data.email,
        sender_email: `noreply@${new URL(appUrl).hostname}`,
        sender_alias: 'AI Visibility Audit',
      }),
    });
  } catch (error) {
    console.error('Failed to send visitor confirmation:', error);
  }
}

export async function POST(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      const sendProgress = (status: string, message: string, progress: number, result?: unknown) => {
        const data = JSON.stringify({ status, message, progress, result });
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      try {
        const body: AuditRequestBody = await request.json();
        const { url, email, contactName, businessName } = body;

        // Validation
        if (!url || !validateUrl(url)) {
          sendProgress('error', 'Please provide a valid website URL', 0);
          controller.close();
          return;
        }

        if (!email || !validateEmail(email)) {
          sendProgress('error', 'Please provide a valid email address', 0);
          controller.close();
          return;
        }

        // Check for duplicate audit within 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const existingAudit = await prisma.audit.findFirst({
          where: {
            url: url,
            status: 'completed',
            createdAt: { gte: twentyFourHoursAgo },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (existingAudit) {
          // Return cached result
          sendProgress('completed', 'Retrieved cached audit', 100, {
            id: existingAudit.id,
            url: existingAudit.url,
            businessName: existingAudit.businessName || businessName || '',
            score: existingAudit.score,
            confidenceLevel: existingAudit.confidenceLevel,
            aiDescription: existingAudit.aiDescription,
            analysisJson: existingAudit.analysisJson,
          });
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          return;
        }

        // Create initial audit record
        sendProgress('processing', 'Starting audit...', 5);
        
        const audit = await prisma.audit.create({
          data: {
            url,
            email,
            contactName: contactName || null,
            businessName: businessName || null,
            status: 'processing',
            ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          },
        });

        // Crawl website
        sendProgress('processing', 'Crawling your website...', 10);
        
        const crawlResult = await crawlWebsite(url, (message, progress) => {
          sendProgress('processing', message, Math.min(progress, 50));
        });

        if (crawlResult.pages.length === 0) {
          const errorMsg = crawlResult.errors.length > 0 
            ? crawlResult.errors[0] 
            : 'Could not access the website. Please check the URL and try again.';
          
          await prisma.audit.update({
            where: { id: audit.id },
            data: { status: 'failed', errorMessage: errorMsg },
          });
          
          sendProgress('error', errorMsg, 0);
          controller.close();
          return;
        }

        // Analyze with LLM
        sendProgress('processing', 'Analyzing AI visibility...', 55);
        
        const analysis = await analyzeWithLLM(crawlResult.pages, businessName);

        sendProgress('processing', 'Generating your report...', 85);

        // Extract business name from analysis if not provided
        const detectedBusinessName = businessName || 
          crawlResult.pages[0]?.title?.split('|')[0]?.split('-')[0]?.trim() || 
          new URL(url).hostname;

        // Update audit with results
        await prisma.audit.update({
          where: { id: audit.id },
          data: {
            status: 'completed',
            businessName: detectedBusinessName,
            score: analysis.score,
            confidenceLevel: analysis.confidence_level,
            aiDescription: analysis.ai_description,
            analysisJson: JSON.parse(JSON.stringify(analysis)),
            rawCrawlData: {
              totalPagesCrawled: crawlResult.totalPagesCrawled,
              totalPagesFound: crawlResult.totalPagesFound,
              pageUrls: crawlResult.pages.map(p => p.url),
            },
          },
        });

        // Send admin notification
        sendAdminNotification({
          id: audit.id,
          url,
          email,
          contactName,
          businessName: detectedBusinessName,
          score: analysis.score,
        });

        // Send visitor confirmation email
        sendVisitorConfirmation({
          email,
          url,
          businessName: detectedBusinessName,
          score: analysis.score,
          aiDescription: analysis.ai_description,
        });

        // Return result
        sendProgress('completed', 'Audit complete!', 100, {
          id: audit.id,
          url,
          businessName: detectedBusinessName,
          score: analysis.score,
          confidenceLevel: analysis.confidence_level,
          aiDescription: analysis.ai_description,
          analysisJson: analysis,
        });

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();

      } catch (error) {
        console.error('Audit error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        sendProgress('error', errorMessage, 0);
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

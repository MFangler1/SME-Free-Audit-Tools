import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Sends the client their own audit report with a working download link.
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await prisma.audit.findUnique({ where: { id: params.id } });
    if (!audit) {
      return NextResponse.json({ success: false, message: 'Report not found' }, { status: 404 });
    }
    if (!audit.email) {
      return NextResponse.json({ success: false, message: 'No email on file for this report' }, { status: 400 });
    }

    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const reportUrl = `${appUrl}/report/${audit.id}`;
    const wordUrl = `${appUrl}/api/audit/docx/${audit.id}`;
    const business = audit.businessName || new URL(audit.url).hostname;
    const score = audit.score ?? 0;
    const greetingName = audit.contactName ? ` ${audit.contactName}` : '';

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1F2937;">
        <h2 style="color: #0D9488; border-bottom: 2px solid #0D9488; padding-bottom: 10px;">
          Your AI Visibility Snapshot is ready
        </h2>
        <p style="font-size: 16px;">Hi${greetingName}, here is your free AI Visibility Snapshot for <a href="${audit.url}" style="color: #0D9488;">${business}</a>.</p>

        <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0D9488; text-align: center;">
          <p style="margin: 0; color: #0F766E; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your AI Discoverability Score</p>
          <p style="margin: 8px 0 0; color: #0D9488; font-size: 48px; font-weight: bold;">${score}<span style="font-size: 22px; color: #0F766E;">/100</span></p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="${reportUrl}" style="background: #0D9488; color: #ffffff; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block; font-size: 16px;">View &amp; Download My Report</a>
        </div>

        <p style="font-size: 14px; color: #374151; text-align: center;">Prefer a Word document? <a href="${wordUrl}" style="color: #0D9488; font-weight: bold;">Download the Word version</a>.</p>
        <p style="font-size: 13px; color: #6B7280; text-align: center;">On the report page you can also download a PDF copy.</p>

        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">Questions? Just reply to this email or contact Mark Fenty at Support@AiConsultancy.org.uk.</p>
      </div>
    `;

    const emailResponse = await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        app_id: process.env.WEB_APP_ID,
        notification_id: process.env.NOTIF_ID_YOUR_AUDIT_REPORT,
        subject: `Your AI Visibility Snapshot: ${score}/100 for ${business}`,
        body: htmlBody,
        is_html: true,
        recipient_email: audit.email,
        sender_email: `noreply@${new URL(appUrl).hostname}`,
        sender_alias: 'AI Visibility Audit',
      }),
    });

    if (!emailResponse.ok) {
      const err = await emailResponse.text().catch(() => '');
      console.error('Failed to send client report email:', err);
      return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 502 });
    }

    return NextResponse.json({ success: true, email: audit.email });
  } catch (error) {
    console.error('Failed to send client report email:', error);
    return NextResponse.json({ success: false, message: 'Failed to send email' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auditId } = body;

    if (!auditId) {
      return NextResponse.json(
        { success: false, message: 'Audit ID is required' },
        { status: 400 }
      );
    }

    await prisma.audit.update({
      where: { id: auditId },
      data: { stage2InterestClicked: true },
    });

    try {
      const audit = await prisma.audit.findUnique({
        where: { id: auditId },
        select: { url: true, email: true, businessName: true, score: true, createdAt: true },
      });

      if (audit) {
        const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const snapshotDate = new Date(audit.createdAt).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        const discountDeadline = new Date(new Date(audit.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
        
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #008080; border-bottom: 2px solid #008080; padding-bottom: 10px;">
              Full Action Plan Purchase Request!
            </h2>
            <p style="color: #333; font-size: 16px;">A client wants to purchase the <strong>Full AI Visibility Action Plan</strong>.</p>
            
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-weight: bold;">ACTION REQUIRED: Process Stripe Payment</p>
            </div>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #008080;">
              <h3 style="margin-top: 0; color: #008080;">Client Details</h3>
              <p style="margin: 10px 0;"><strong>Website:</strong> <a href="${audit.url}" style="color: #008080;">${audit.url}</a></p>
              <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${audit.email}" style="color: #008080;">${audit.email}</a></p>
              <p style="margin: 10px 0;"><strong>Business Name:</strong> ${audit.businessName || 'Not provided'}</p>
              <p style="margin: 10px 0;"><strong>AI Visibility Score:</strong> ${audit.score}/100</p>
              <p style="margin: 10px 0;"><strong>Free Snapshot Date:</strong> ${snapshotDate}</p>
            </div>
            
            <div style="background: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
              <h3 style="margin-top: 0; color: #dc2626;">Pricing</h3>
              <p style="margin: 10px 0;"><strong>Standard Price:</strong> £197</p>
              <p style="margin: 10px 0;"><strong>30% Discount Price:</strong> £138 (if ordered by ${discountDeadline})</p>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #1e40af;">Next Steps</h3>
              <ol style="color: #1e40af; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Send Stripe payment link to <a href="mailto:${audit.email}" style="color: #1e40af;">${audit.email}</a></li>
                <li style="margin-bottom: 8px;">Confirm payment amount (£138 if within 7 days, £197 after)</li>
                <li style="margin-bottom: 8px;">Once payment confirmed, generate Full Action Plan</li>
                <li>Deliver plan with implementation guidance and ROI reporting options</li>
              </ol>
            </div>
            
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              Request received: ${new Date().toLocaleString('en-GB')}
            </p>
          </div>
        `;

        await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deployment_token: process.env.ABACUSAI_API_KEY,
            app_id: process.env.WEB_APP_ID,
            notification_id: process.env.NOTIF_ID_FULL_ACTION_PLAN_PURCHASE_REQUEST,
            subject: `Action Plan Purchase: ${audit.businessName || audit.url} - Process Stripe Payment`,
            body: htmlBody,
            is_html: true,
            recipient_email: 'mark.fenty@gmail.com',
            sender_email: `noreply@${new URL(appUrl).hostname}`,
            sender_alias: 'AI Visibility Audit',
          }),
        });
      }
    } catch (notifError) {
      console.error('Failed to send purchase request notification:', notifError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to record interest:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to record interest' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { buildReportHtml, ReportAudit } from '@/lib/report-html';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Creates a PDF generation request for the given audit and returns a request_id.
// The client polls /api/audit/pdf/status until the PDF is ready.
export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await prisma.audit.findUnique({ where: { id: params.id } });
    if (!audit) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    const html = buildReportHtml(audit as unknown as ReportAudit);

    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.ABACUSAI_API_KEY}`,
      },
      body: JSON.stringify({
        html_content: html,
        pdf_options: {
          format: 'A4',
          print_background: true,
          margin: { top: '12mm', right: '12mm', bottom: '12mm', left: '12mm' },
        },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json().catch(() => ({ error: 'Failed to create PDF request' }));
      return NextResponse.json({ success: false, error: error.error }, { status: 500 });
    }

    const { request_id } = await createResponse.json();
    if (!request_id) {
      return NextResponse.json({ success: false, error: 'No request ID returned' }, { status: 500 });
    }

    return NextResponse.json({ success: true, request_id });
  } catch (error) {
    console.error('Error creating PDF request:', error);
    return NextResponse.json({ success: false, error: 'Failed to create PDF request' }, { status: 500 });
  }
}

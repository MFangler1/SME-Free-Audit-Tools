import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { ReportAnalysisData } from '@/lib/report-html';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const TEAL = '0D9488';
const TEAL_DARK = '0F766E';
const NAVY = '1E3A5F';

function scoreInterpretation(score: number): string {
  if (score >= 80) return 'Your business has strong AI visibility';
  if (score >= 60) return 'Your business has moderate AI visibility with room for improvement';
  if (score >= 40) return 'Your business is partially visible to AI search systems';
  if (score >= 20) return 'Your business is barely visible to AI search systems';
  return 'Your business is essentially invisible to AI search systems';
}

function heading(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 28, color: TEAL_DARK })],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, color: '374151' })],
  });
}

function labelValue(label: string, value: string): Paragraph {
  return new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22, color: '1F2937' }),
      new TextRun({ text: value || 'Not found', size: 22, color: '374151' }),
    ],
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const audit = await prisma.audit.findUnique({ where: { id: params.id } });
    if (!audit) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const analysis = (audit.analysisJson || {}) as ReportAnalysisData;
    const score = (audit.score ?? analysis.score ?? 0) as number;
    const business = audit.businessName || new URL(audit.url).hostname;
    const confidence = audit.confidenceLevel || analysis.confidence_level || 'Low';
    const description = audit.aiDescription || analysis.ai_description || 'Analysis in progress...';
    const facts = analysis.facts_found || {};
    const gaps = analysis.gaps || [];
    const contentGaps = analysis.content_gaps || [];
    const typesPresent = analysis.schema_status?.types_present || [];
    const typesMissing = analysis.schema_status?.types_missing || [];
    const reasoning = analysis.score_reasoning || '';
    const dateStr = new Date(audit.createdAt || new Date()).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const children: Paragraph[] = [];

    // Header
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: 'AI CONSULTANCY', bold: true, size: 22, color: TEAL })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: 'Your FREE Website Visibility Snapshot', bold: true, size: 36, color: TEAL_DARK })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [new TextRun({ text: `for ${business}`, size: 24, color: '4B5563' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [new TextRun({ text: audit.url, size: 20, color: '6B7280' })],
      })
    );
    if (audit.contactName) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 20 },
          children: [new TextRun({ text: `Prepared for ${audit.contactName}`, size: 20, color: '6B7280' })],
        })
      );
    }
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: TEAL, space: 8 } },
        children: [new TextRun({ text: `Report date: ${dateStr}`, size: 18, color: '9CA3AF' })],
      })
    );

    // Score
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 120, after: 20 },
        children: [new TextRun({ text: 'YOUR AI DISCOVERABILITY SCORE', bold: true, size: 22, color: NAVY })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 20 },
        children: [new TextRun({ text: `${score}/100`, bold: true, size: 72, color: TEAL })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: scoreInterpretation(score), size: 24, color: '374151' })],
      })
    );
    if (reasoning) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 160 },
          children: [new TextRun({ text: reasoning, italics: true, size: 20, color: '6B7280' })],
        })
      );
    }

    // How AI sees you
    children.push(heading('How AI Currently Sees You'));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [new TextRun({ text: `“${description}”`, italics: true, size: 22, color: '374151' })],
      })
    );
    children.push(labelValue('Confidence level', confidence));
    children.push(labelValue('Target Audience', facts.who || ''));
    children.push(labelValue('Services / Products', facts.what || ''));
    children.push(labelValue('Service Area', facts.where || ''));
    children.push(labelValue('Value Proposition', facts.why || ''));
    children.push(labelValue('Credentials / Proof', facts.proof || ''));

    // Critical issues
    children.push(heading('Critical Issues Found'));
    if (gaps.length) {
      gaps.forEach((g) => children.push(bullet(g)));
    } else {
      children.push(new Paragraph({ children: [new TextRun({ text: 'No critical issues detected.', italics: true, size: 22, color: '6B7280' })] }));
    }

    // Schema
    children.push(heading('Structured Data (Schema)'));
    children.push(labelValue('Schema types present', typesPresent.length ? typesPresent.join(', ') : 'None detected'));
    children.push(labelValue('Missing schema types', typesMissing.length ? typesMissing.join(', ') : 'All critical schemas present'));

    if (contentGaps.length) {
      children.push(heading('Content Gaps'));
      contentGaps.forEach((c) => children.push(bullet(c)));
    }

    // What's next
    children.push(heading('Ready to Fix These Issues?'));
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: 'This FREE Snapshot shows you what’s wrong. Your Full AI Visibility Action Plan shows you exactly how to fix it — with an in-depth analysis, a Google Analytics baseline, an ROI projection, a structured data implementation guide, and an AI-centric content roadmap.',
            size: 22,
            color: '374151',
          }),
        ],
      })
    );
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: '£197 standard — or £138 (30% off) if you order within 7 days.', bold: true, size: 22, color: NAVY }),
        ],
      })
    );

    // Footer
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 20 },
        border: { top: { style: BorderStyle.SINGLE, size: 8, color: 'E5E7EB', space: 8 } },
        children: [new TextRun({ text: 'Mark Fenty', bold: true, size: 22, color: '374151' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Consultant & Founder, AI Consultancy', size: 20, color: '6B7280' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Support@AiConsultancy.org.uk', size: 20, color: '6B7280' })],
      })
    );

    const doc = new Document({
      sections: [{ properties: {}, children }],
    });

    const buffer = await Packer.toBuffer(doc);
    const safeName = business.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'report';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="ai-visibility-snapshot-${safeName}.docx"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error generating DOCX:', error);
    return NextResponse.json({ error: 'Failed to generate Word document' }, { status: 500 });
  }
}

// Shared, standalone branded HTML builder for the AI Visibility Audit report.
// Used by the PDF generation route (and available for emails).

export interface ReportAnalysisData {
  ai_description?: string;
  confidence_level?: string;
  facts_found?: {
    who?: string;
    what?: string;
    where?: string;
    why?: string;
    proof?: string;
  };
  gaps?: string[];
  schema_status?: {
    types_present?: string[];
    types_missing?: string[];
    errors?: string[];
  };
  content_gaps?: string[];
  score?: number;
  score_reasoning?: string;
}

export interface ReportAudit {
  id: string;
  url: string;
  businessName?: string | null;
  contactName?: string | null;
  score?: number | null;
  confidenceLevel?: string | null;
  aiDescription?: string | null;
  analysisJson?: unknown;
  createdAt?: Date | string | null;
}

const TEAL = '#0D9488';
const TEAL_DARK = '#0F766E';
const NAVY = '#1E3A5F';
const CORAL = '#E96D4B';

function esc(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function scoreInterpretation(score: number): string {
  if (score >= 80) return 'Your business has strong AI visibility';
  if (score >= 60) return 'Your business has moderate AI visibility with room for improvement';
  if (score >= 40) return 'Your business is partially visible to AI search systems';
  if (score >= 20) return 'Your business is barely visible to AI search systems';
  return 'Your business is essentially invisible to AI search systems';
}

function scoreColor(score: number): string {
  if (score >= 60) return TEAL;
  if (score >= 40) return '#F59E0B';
  return '#DC2626';
}

export function buildReportHtml(audit: ReportAudit): string {
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
  const dateStr = new Date(audit.createdAt ? new Date(audit.createdAt) : new Date()).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const discountDeadline = new Date(
    (audit.createdAt ? new Date(audit.createdAt).getTime() : Date.now()) + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  const factsRows = [
    { label: 'Target Audience', value: facts.who },
    { label: 'Services / Products', value: facts.what },
    { label: 'Service Area', value: facts.where },
    { label: 'Value Proposition', value: facts.why },
    { label: 'Credentials / Proof', value: facts.proof },
  ]
    .map(
      (f) => `
        <div style="border:1px solid ${TEAL}22;background:#F0FDFA;border-radius:8px;padding:12px 14px;">
          <div style="font-size:12px;font-weight:bold;color:${TEAL_DARK};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">${esc(f.label)}</div>
          <div style="font-size:14px;color:#374151;">${f.value ? esc(f.value) : '<span style="color:#DC2626;font-style:italic;">Not found</span>'}</div>
        </div>`
    )
    .join('');

  const gapsList = gaps.length
    ? gaps
        .map(
          (g) => `<li style="margin:0 0 10px;padding:10px 14px;background:#FEF2F2;border:1px solid #FEE2E2;border-radius:8px;color:#374151;list-style:none;">${esc(g)}</li>`
        )
        .join('')
    : '<li style="color:#6B7280;font-style:italic;list-style:none;">No critical issues detected.</li>';

  const presentChips = typesPresent.length
    ? typesPresent.map((t) => `<span style="display:inline-block;background:#DCFCE7;color:#15803D;font-size:12px;padding:4px 8px;border-radius:6px;margin:2px;">${esc(t)}</span>`).join('')
    : '<span style="color:#16A34A;font-style:italic;font-size:13px;">No structured data detected</span>';

  const missingChips = typesMissing.length
    ? typesMissing.map((t) => `<span style="display:inline-block;background:#FEF3C7;color:#B45309;font-size:12px;padding:4px 8px;border-radius:6px;margin:2px;">${esc(t)}</span>`).join('')
    : '<span style="color:#D97706;font-style:italic;font-size:13px;">All critical schemas present</span>';

  const contentGapsBlock = contentGaps.length
    ? `<div style="background:#EFF6FF;border:1px solid #DBEAFE;border-radius:8px;padding:16px;margin-top:16px;">
         <div style="font-weight:bold;color:#1E40AF;margin-bottom:8px;">Content Gaps</div>
         <ul style="margin:0;padding-left:18px;color:#1D4ED8;font-size:14px;">${contentGaps.map((c) => `<li style="margin-bottom:4px;">${esc(c)}</li>`).join('')}</ul>
       </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>AI Visibility Snapshot — ${esc(business)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color:#1F2937; margin:0; padding:0; background:#ffffff; }
  .wrap { max-width: 760px; margin: 0 auto; padding: 32px; }
  h1,h2,h3 { margin: 0; }
  .section { border:1px solid #E5E7EB; border-radius:12px; padding:24px; margin-bottom:20px; }
  .section-title { font-size:18px; font-weight:bold; color:${TEAL_DARK}; margin-bottom:16px; }
  .grid { display:grid; grid-template-columns: 1fr 1fr; gap:10px; }
</style>
</head>
<body>
  <div class="wrap">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:3px solid ${TEAL};margin-bottom:28px;">
      <div style="font-size:14px;font-weight:bold;color:${TEAL};letter-spacing:1px;text-transform:uppercase;margin-bottom:6px;">AI Consultancy</div>
      <h1 style="font-size:26px;color:${TEAL_DARK};margin-bottom:6px;">Your FREE Website Visibility Snapshot</h1>
      <div style="font-size:15px;color:#4B5563;">for <strong style="color:${TEAL_DARK};">${esc(business)}</strong></div>
      <div style="font-size:13px;color:#6B7280;margin-top:4px;">${esc(audit.url)}</div>
      ${audit.contactName ? `<div style="font-size:13px;color:#6B7280;margin-top:4px;">Prepared for ${esc(audit.contactName)}</div>` : ''}
      <div style="font-size:12px;color:#9CA3AF;margin-top:8px;">Report date: ${esc(dateStr)}</div>
    </div>

    <!-- Score -->
    <div style="background:${NAVY};border-radius:12px;padding:28px;text-align:center;color:#ffffff;margin-bottom:20px;">
      <div style="font-size:13px;text-transform:uppercase;letter-spacing:1px;color:#CBD5E1;margin-bottom:8px;">Your AI Discoverability Score</div>
      <div style="font-size:56px;font-weight:bold;color:${scoreColor(score)};line-height:1;">${score}<span style="font-size:24px;color:#CBD5E1;">/100</span></div>
      <div style="font-size:16px;margin-top:12px;">${esc(scoreInterpretation(score))}</div>
      ${reasoning ? `<div style="font-size:13px;color:#CBD5E1;font-style:italic;margin-top:10px;">${esc(reasoning)}</div>` : ''}
    </div>

    <!-- How AI sees you -->
    <div class="section">
      <div class="section-title">How AI Currently Sees You</div>
      <div style="background:#F9FAFB;border-radius:8px;padding:16px;font-style:italic;font-size:15px;color:#374151;line-height:1.6;">&ldquo;${esc(description)}&rdquo;</div>
      <div style="margin-top:12px;font-size:13px;color:#6B7280;"><strong>Confidence level:</strong> ${esc(confidence)}</div>
      <div style="margin-top:16px;" class="grid">${factsRows}</div>
    </div>

    <!-- Critical issues -->
    <div class="section">
      <div class="section-title">Critical Issues Found</div>
      <ul style="margin:0;padding:0;">${gapsList}</ul>
      <div style="margin-top:16px;" class="grid">
        <div style="background:#F0FDF4;border:1px solid #DCFCE7;border-radius:8px;padding:14px;">
          <div style="font-weight:bold;color:#15803D;margin-bottom:8px;">Schema Types Present</div>${presentChips}
        </div>
        <div style="background:#FFFBEB;border:1px solid #FEF3C7;border-radius:8px;padding:14px;">
          <div style="font-weight:bold;color:#B45309;margin-bottom:8px;">Missing Schema Types</div>${missingChips}
        </div>
      </div>
      ${contentGapsBlock}
    </div>

    <!-- What's next -->
    <div style="background:#F0FDFA;border:1px solid ${TEAL}55;border-radius:12px;padding:24px;margin-bottom:20px;">
      <div style="font-size:18px;font-weight:bold;color:${TEAL_DARK};margin-bottom:8px;">Ready to Fix These Issues?</div>
      <p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 14px;">This <strong>FREE Snapshot</strong> shows you <em>what&rsquo;s wrong</em>. Your <strong>Full AI Visibility Action Plan</strong> shows you exactly <em>how to fix it</em> — with an in-depth analysis, a Google Analytics baseline, an ROI projection, a structured data implementation guide, and an AI-centric content roadmap.</p>
      <div style="background:${NAVY};color:#ffffff;border-radius:8px;padding:16px;display:flex;justify-content:space-between;align-items:center;">
        <div>
          <div style="font-weight:bold;font-size:16px;">30% OFF — Order within 7 days</div>
          <div style="font-size:13px;color:#CBD5E1;">Your discount expires ${esc(discountDeadline)}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:13px;text-decoration:line-through;color:#94A3B8;">£197</div>
          <div style="font-size:24px;font-weight:bold;color:${CORAL};">£138</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #E5E7EB;padding-top:20px;color:#6B7280;font-size:13px;">
      <div style="font-weight:bold;color:#374151;">Mark Fenty</div>
      <div>Consultant &amp; Founder, AI Consultancy</div>
      <div style="margin-top:4px;">Support@AiConsultancy.org.uk</div>
    </div>

  </div>
</body>
</html>`;
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  ArrowRight,
  Sparkles,
  Target,
  MessageSquare,
  Map,
  Award,
  HelpCircle,
  Zap,
  Clock,
  BarChart3,
  LineChart,
  Users,
  Percent,
  Download,
  Loader2,
  Mail,
  FileType2,
} from 'lucide-react';
import ScoreGauge from './score-gauge';

interface AnalysisData {
  ai_description: string;
  confidence_level: string;
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

interface AuditResult {
  id: string;
  url: string;
  businessName: string;
  score: number;
  confidenceLevel: string;
  aiDescription: string;
  analysisJson: AnalysisData | null;
}

interface AuditReportProps {
  result: AuditResult;
}

const getConfidenceBadge = (level: string) => {
  const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    High: { bg: 'bg-[#F0FDFA]', text: 'text-[#0D9488]', icon: <CheckCircle className="w-4 h-4" /> },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-700', icon: <AlertTriangle className="w-4 h-4" /> },
    Low: { bg: 'bg-red-50', text: 'text-red-600', icon: <XCircle className="w-4 h-4" /> },
  };
  return styles[level] || styles['Low'];
};

const getScoreInterpretation = (score: number): string => {
  if (score >= 80) return 'Your business has strong AI visibility';
  if (score >= 60) return 'Your business has moderate AI visibility with room for improvement';
  if (score >= 40) return 'Your business is partially visible to AI search systems';
  if (score >= 20) return 'Your business is barely visible to AI search systems';
  return 'Your business is essentially invisible to AI search systems';
};

const getBenchmark = (score: number): string => {
  if (score >= 80) return 'You\'re in the top 15% of similar businesses';
  if (score >= 60) return 'About 40% of similar businesses score higher';
  if (score >= 40) return 'About 60% of similar businesses score higher';
  if (score >= 20) return 'About 80% of similar businesses score higher';
  return 'Nearly all similar businesses score higher';
};

export default function AuditReport({ result }: AuditReportProps) {
  const [stage2Interest, setStage2Interest] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const analysis = result?.analysisJson;
  const confidenceBadge = getConfidenceBadge(result?.confidenceLevel || 'Low');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownloadPdf = async () => {
    if (!result?.id || pdfLoading) return;
    setPdfLoading(true);
    try {
      const createRes = await fetch(`/api/audit/pdf/${result.id}`, { method: 'POST' });
      const createData = await createRes.json();
      if (!createData?.success || !createData?.request_id) {
        throw new Error(createData?.error || 'Failed to start PDF generation');
      }
      const requestId = createData.request_id;
      const startedAt = Date.now();
      // Poll the status route until the PDF is ready (up to 5 minutes).
      while (Date.now() - startedAt < 5 * 60 * 1000) {
        await new Promise((r) => setTimeout(r, 2000));
        const stRes = await fetch('/api/audit/pdf/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_id: requestId }),
        });
        const stData = await stRes.json();
        if (stData?.status === 'SUCCESS' && stData?.pdf_base64) {
          const blob = new Blob([Uint8Array.from(atob(stData.pdf_base64), (c) => c.charCodeAt(0))], {
            type: 'application/pdf',
          });
          const objectUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = objectUrl;
          const safe = (result.businessName || 'report').replace(/[^a-z0-9]+/gi, '-').toLowerCase();
          link.download = `ai-visibility-snapshot-${safe}.pdf`;
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(objectUrl);
          return;
        }
        if (stData?.status === 'FAILED') {
          throw new Error(stData?.error || 'PDF generation failed');
        }
      }
      throw new Error('PDF generation timed out');
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Sorry, we could not generate the PDF just now. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadWord = () => {
    if (!result?.id) return;
    const link = document.createElement('a');
    link.href = `/api/audit/docx/${result.id}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleEmailReport = async () => {
    if (!result?.id || emailState === 'sending') return;
    setEmailState('sending');
    try {
      const res = await fetch(`/api/audit/email/${result.id}`, { method: 'POST' });
      const data = await res.json();
      setEmailState(data?.success ? 'sent' : 'error');
    } catch (error) {
      console.error('Failed to email report:', error);
      setEmailState('error');
    }
  };

  const handleStage2Interest = async () => {
    setStage2Interest(true);
    try {
      await fetch('/api/audit/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditId: result?.id }),
      });
    } catch (error) {
      console.error('Failed to track interest:', error);
    }
  };

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-2xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="h-48 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 bg-[#F0FDFA] border border-[#0D9488] text-[#0D9488] rounded-full px-4 py-2 mb-4">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">FREE Snapshot Complete</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0D9488] mb-2">
          Your FREE Website Visibility Snapshot
        </h2>
        <p className="text-gray-600">
          for <span className="font-medium text-[#0D9488]">{result?.url || 'your website'}</span>
        </p>
      </motion.div>

      {/* Download / Email Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-4"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-white bg-[#0D9488] hover:bg-[#0F766E] transition-colors disabled:opacity-70"
          >
            {pdfLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Preparing PDF...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download PDF
              </>
            )}
          </button>

          <button
            onClick={handleDownloadWord}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-[#0D9488] bg-[#F0FDFA] border border-[#0D9488] hover:bg-[#0D9488] hover:text-white transition-colors"
          >
            <FileType2 className="w-4 h-4" />
            Download Word
          </button>

          <button
            onClick={handleEmailReport}
            disabled={emailState === 'sending' || emailState === 'sent'}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-[#1E3A5F] bg-white border border-gray-200 hover:border-[#0D9488] hover:text-[#0D9488] transition-colors disabled:opacity-70"
          >
            {emailState === 'sending' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : emailState === 'sent' ? (
              <>
                <CheckCircle className="w-4 h-4 text-[#0D9488]" />
                Sent to your inbox
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Email me my report
              </>
            )}
          </button>
        </div>
        {emailState === 'error' && (
          <p className="text-center text-sm text-red-600 mt-3">
            Sorry, we couldn&apos;t send the email just now. Please try again.
          </p>
        )}
      </motion.div>

      {/* Section 1: How AI Currently Sees You */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#F0FDFA] rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-[#0D9488]" />
          </div>
          <h3 className="text-xl font-bold text-[#0D9488]">How AI Currently Sees You</h3>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <p className="text-gray-700 italic text-lg leading-relaxed">
            &quot;{analysis?.ai_description || result?.aiDescription || 'Analysis in progress...'}&quot;
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${confidenceBadge.bg} ${confidenceBadge.text}`}>
            {confidenceBadge.icon}
            <span className="text-sm font-medium">{result?.confidenceLevel || 'Low'} Confidence</span>
          </div>
          <p className="text-sm text-gray-500">
            {result?.confidenceLevel === 'High' 
              ? 'AI systems can clearly understand your business'
              : result?.confidenceLevel === 'Medium'
              ? 'AI systems have a partial understanding of your business'
              : 'AI systems struggle to understand your business'
            }
          </p>
        </div>

        {/* Facts Found */}
        {analysis?.facts_found && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'who', label: 'Target Audience', icon: Target, value: analysis.facts_found.who },
              { key: 'what', label: 'Services/Products', icon: FileText, value: analysis.facts_found.what },
              { key: 'where', label: 'Service Area', icon: Map, value: analysis.facts_found.where },
              { key: 'why', label: 'Value Proposition', icon: Sparkles, value: analysis.facts_found.why },
              { key: 'proof', label: 'Credentials/Proof', icon: Award, value: analysis.facts_found.proof },
            ].map((fact) => (
              <div key={fact.key} className="bg-[#F0FDFA] border border-[#0D9488]/20 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <fact.icon className="w-4 h-4 text-[#0D9488]" />
                  <span className="text-sm font-medium text-gray-700">{fact.label}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {fact.value || <span className="text-red-500 italic">Not found</span>}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* Section 2: Critical Issues Found */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-[#0D9488]">Critical Issues Found</h3>
        </div>

        <div className="space-y-4">
          {(analysis?.gaps || []).map((gap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg"
            >
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">{gap}</p>
            </motion.div>
          ))}
        </div>

        {/* Schema Status */}
        {analysis?.schema_status && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-100 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Schema Types Present
              </h4>
              {(analysis.schema_status.types_present?.length || 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.schema_status.types_present.map((type, i) => (
                    <span key={i} className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-green-600 italic">No structured data detected</p>
              )}
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
              <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                Missing Schema Types
              </h4>
              {(analysis.schema_status.types_missing?.length || 0) > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.schema_status.types_missing.map((type, i) => (
                    <span key={i} className="text-sm bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      {type}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-amber-600 italic">All critical schemas present</p>
              )}
            </div>
          </div>
        )}

        {/* Content Gaps */}
        {analysis?.content_gaps && (analysis.content_gaps.length || 0) > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Content Gaps
            </h4>
            <ul className="space-y-1">
              {analysis.content_gaps.map((gap, i) => (
                <li key={i} className="text-sm text-blue-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.section>

      {/* Section 3: AI Discoverability Score */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1E3A5F] rounded-2xl shadow-lg p-6 md:p-8 text-white"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold">Your AI Discoverability Score</h3>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <ScoreGauge score={result?.score || 0} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-xl font-medium mb-2">
              {getScoreInterpretation(result?.score || 0)}
            </p>
            <p className="text-white/80 mb-4">
              {getBenchmark(result?.score || 0)}
            </p>
            <p className="text-sm text-white/70 italic">
              {analysis?.score_reasoning || ''}
            </p>
          </div>
        </div>
      </motion.section>

      {/* Section 4: What's Next - Full AI Visibility Action Plan CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#F0FDFA] rounded-2xl shadow-lg p-6 md:p-8 border border-[#0D9488]/30 relative overflow-hidden"
      >
        {/* Limited Time Badge */}
        <div className="absolute top-4 right-4">
          <div className="bg-[#E96D4B] text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
            <Clock className="w-3 h-3" />
            LIMITED TIME OFFER
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#0D9488] rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0D9488]">Ready to Fix These Issues?</h3>
            <p className="text-sm text-gray-600">Get your Full AI Visibility Action Plan</p>
          </div>
        </div>

        <p className="text-gray-700 mb-6">
          This <strong>FREE Snapshot</strong> shows you <em>what&apos;s wrong</em>. Your <strong>Full AI Visibility Action Plan</strong> shows you exactly <em>how to fix it</em> — with step-by-step implementation guidance tailored to your business.
        </p>

        {/* FOMO Discount Banner */}
        <div className="bg-[#1E3A5F] text-white rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Percent className="w-8 h-8 text-[#E96D4B]" />
              <div>
                <p className="font-bold text-lg">30% OFF — Order Within 7 Days</p>
                <p className="text-white/80 text-sm">Your discount expires 7 days from today</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm line-through text-white/60">£197</p>
              <p className="text-2xl font-bold text-[#0D9488]">£138</p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-100">
          <h4 className="font-bold text-[#0D9488] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Full Action Plan Includes:
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">In-Depth Website & AI Search Visibility Analysis</p>
                <p className="text-sm text-gray-600">More detailed than this snapshot — covering every page, every gap, every opportunity</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-4 h-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Google Analytics–Driven Baseline Report</p>
                <p className="text-sm text-gray-600">We&apos;ll establish your current traffic baseline so you can measure real improvement</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center flex-shrink-0">
                <LineChart className="w-4 h-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Proposed ROI Projection</p>
                <p className="text-sm text-gray-600">See exactly what results you can expect when the plan is implemented correctly</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Structured Data Implementation Guide</p>
                <p className="text-sm text-gray-600">Exact JSON-LD code snippets ready to copy and paste into your website</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#F0FDFA] rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4 text-[#0D9488]" />
              </div>
              <div>
                <p className="font-medium text-gray-900">AI-Centric Content Roadmap</p>
                <p className="text-sm text-gray-600">15-20 specific questions your content should answer, grouped into priority clusters</p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Options */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 mb-6">
          <h4 className="font-bold text-[#0D9488] mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Flexible Implementation Options
          </h4>
          <p className="text-gray-600 text-sm mb-3">
            Once you have your Action Plan, you can:
          </p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" />
              <span><strong>Implement it yourself</strong> or hand it to your internal team or Media Management Agent</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" />
              <span><strong>Ask us to implement</strong> all or part of the plan on your behalf</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#0D9488] mt-0.5 flex-shrink-0" />
              <span>Get a <strong>before-and-after ROI view</strong> to support your purchasing decision</span>
            </li>
          </ul>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleStage2Interest}
            disabled={stage2Interest}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-lg font-semibold text-lg transition-all ${
              stage2Interest
                ? 'bg-[#F0FDFA] text-[#0D9488] border border-[#0D9488] cursor-default'
                : 'btn-coral shadow-lg hover:shadow-xl'
            }`}
          >
            {stage2Interest ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Interest Registered — We&apos;ll Be in Touch!
              </>
            ) : (
              <>
                Get My Full Action Plan — 30% Off
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center">
            Price increases to £197 after 7 days. One-time payment, no subscription.
          </p>
        </div>

        {stage2Interest && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-[#F0FDFA] border border-[#0D9488]/30 rounded-lg"
          >
            <p className="text-[#0F766E] text-sm">
              <strong>Excellent choice!</strong> We&apos;ve registered your interest and will be in touch within 24 hours with payment details and next steps for your personalised Full AI Visibility Action Plan.
            </p>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}

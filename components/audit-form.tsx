'use client';

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, Building2, Search, Loader2, CheckCircle, AlertCircle, ArrowRight, Clock, Gift, Zap, User } from 'lucide-react';
import AuditReport from './audit-report';

interface AuditState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  stage: string;
  progress: number;
  auditId?: string;
  result?: AuditResult | null;
  error?: string;
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

const STAGES = [
  'Checking your website...',
  'Crawling your pages...',
  'Analyzing AI visibility...',
  'Generating your report...',
];

export default function AuditForm() {
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [auditState, setAuditState] = useState<AuditState>({
    status: 'idle',
    stage: '',
    progress: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateUrl = (input: string): boolean => {
    try {
      const urlToTest = input.startsWith('http') ? input : `https://${input}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (input: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateUrl(url)) {
      setAuditState({
        status: 'error',
        stage: '',
        progress: 0,
        error: 'Please enter a valid website URL',
      });
      return;
    }

    if (!validateEmail(email)) {
      setAuditState({
        status: 'error',
        stage: '',
        progress: 0,
        error: 'Please enter a valid email address',
      });
      return;
    }

    setAuditState({
      status: 'processing',
      stage: STAGES[0],
      progress: 5,
    });

    try {
      const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
      
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: normalizedUrl,
          email,
          contactName: contactName || undefined,
          businessName: businessName || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Failed to start audit');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to read response');

      const decoder = new TextDecoder();
      let partialRead = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        partialRead += decoder.decode(value, { stream: true });
        const lines = partialRead.split('\n');
        partialRead = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.status === 'processing') {
                const stageIndex = Math.min(
                  Math.floor((parsed.progress || 0) / 25),
                  STAGES.length - 1
                );
                setAuditState(prev => ({
                  ...prev,
                  status: 'processing',
                  stage: parsed.message || STAGES[stageIndex],
                  progress: parsed.progress || prev.progress + 1,
                }));
              } else if (parsed.status === 'completed') {
                setAuditState({
                  status: 'completed',
                  stage: 'Complete!',
                  progress: 100,
                  result: parsed.result,
                  auditId: parsed.result?.id,
                });
                return;
              } else if (parsed.status === 'error') {
                throw new Error(parsed.message || 'Audit failed');
              }
            } catch (parseError) {
              // Skip invalid JSON chunks
            }
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setAuditState({
        status: 'error',
        stage: '',
        progress: 0,
        error: errorMessage,
      });
    }
  };

  const resetForm = () => {
    setAuditState({ status: 'idle', stage: '', progress: 0 });
    setUrl('');
    setEmail('');
    setContactName('');
    setBusinessName('');
  };

  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-8" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
            <div className="h-12 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Show report if completed
  if (auditState.status === 'completed' && auditState.result) {
    return (
      <div>
        <AuditReport result={auditState.result} />
        <div className="mt-8 text-center">
          <button
            onClick={resetForm}
            className="text-[#0D9488] hover:text-[#0F766E] font-medium inline-flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Run another audit
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#F0FDFA] border border-[#0D9488] text-[#0D9488] rounded-full px-4 py-1.5 mb-4">
          <Gift className="w-4 h-4" />
          <span className="text-sm font-medium">100% Free Assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-[#0D9488] mb-3">
          Get Your FREE Website Visibility Snapshot
        </h2>
        <p className="text-gray-600">
          Enter your website URL and discover how AI search systems currently see your business.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {auditState.status === 'processing' ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12"
          >
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#0D9488] animate-spin mx-auto mb-6" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {auditState.stage}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                This may take up to 60 seconds
              </p>
              
              {/* Progress Bar */}
              <div className="max-w-md mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#0D9488]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${auditState.progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">{auditState.progress}% complete</p>
              </div>

              {/* Stage Indicators */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {STAGES.map((stage, index) => {
                  const isActive = auditState.stage === stage;
                  const isPast = STAGES.indexOf(auditState.stage) > index;
                  return (
                    <div
                      key={stage}
                      className={`flex items-center gap-2 text-sm ${
                        isActive ? 'text-[#0D9488] font-medium' :
                        isPast ? 'text-[#0D9488]' : 'text-gray-400'
                      }`}
                    >
                      {isPast ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : isActive ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      )}
                      <span className="hidden sm:inline">{stage}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Error Display */}
            {auditState.status === 'error' && auditState.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-medium">Unable to complete audit</p>
                  <p className="text-red-600 text-sm">{auditState.error}</p>
                </div>
              </div>
            )}

            {/* URL Input */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D9488]" />
                <input
                  type="text"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com or https://example.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D9488]" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Your Name Input */}
            <div>
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D9488]" />
                <input
                  type="text"
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Business Name Input */}
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                Business Name <span className="text-gray-400">(optional)</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0D9488]" />
                <input
                  type="text"
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Company Name"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none transition-all text-gray-900 placeholder:text-gray-400 bg-gray-50 focus:bg-white"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                We&apos;ll try to detect this from your website if not provided
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-coral py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Start Your Free AI Assessment Now
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Features Row */}
            <div className="flex flex-wrap justify-center gap-4 pt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> 60 seconds
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" /> Instant results
              </span>
              <span>|</span>
              <span className="flex items-center gap-1">
                <Gift className="w-3 h-3" /> No email required to start
              </span>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

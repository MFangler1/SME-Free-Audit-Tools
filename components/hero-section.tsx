'use client';

import { motion } from 'framer-motion';
import { Clock, Gift, Zap, Search, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-6">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-red-700">73% of UK businesses are invisible to AI search</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6 text-[#0D9488]">
              Is Your Business Invisible to AI Search?
            </h1>

            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              ChatGPT, Perplexity, Claude, and Google AI Overviews are changing how customers find businesses. If AI can&apos;t understand your website, you&apos;re losing leads every day.
            </p>

            <p className="text-gray-500 mb-8">
              Get your <strong className="text-[#0D9488]">FREE Website Visibility Snapshot</strong> and discover exactly why AI can&apos;t find your business.
            </p>

            <div className="flex flex-wrap gap-6 mb-8">
              {[
                { icon: Clock, label: '60 Seconds', desc: 'Quick Analysis' },
                { icon: Gift, label: '100% Free', desc: 'No Card Required' },
                { icon: Zap, label: 'Instant Results', desc: 'Immediate Access' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="icon-circle-solid w-10 h-10 rounded-full flex items-center justify-center bg-[#0D9488]">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link href="#audit-form" className="btn-coral inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl text-lg">
                <Search className="w-5 h-5" />
                Get My FREE Snapshot
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="hidden md:block">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 overflow-hidden">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="text-sm text-gray-400 ml-2">AI Search Query</span>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-2">User asks AI:</p>
                    <p className="font-medium text-gray-800">&quot;Find me a marketing agency in London that specialises in B2B tech&quot;</p>
                  </div>
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-700">AI Response:</p>
                        <p className="text-sm text-red-600 italic mt-1">&quot;I found several options, but I couldn&apos;t find specific information about [Your Business]...&quot;</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-500">Your business is <span className="font-semibold text-red-600">missing</span> from AI results</p>
                  </div>
                </div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#F0FDFA] rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-[#0D9488]" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">73%</p>
                    <p className="text-xs text-gray-500">of B2B buyers use AI search</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-gray-100">
          {[
            { icon: Clock, label: '60 Seconds', desc: 'Quick and easy' },
            { icon: Gift, label: '100% Free', desc: 'No hidden costs' },
            { icon: Zap, label: 'Instant Results', desc: 'Immediate access' },
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#0D9488] flex items-center justify-center mb-3">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}


'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Clock, Target, TrendingUp, Award, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-50 via-white to-teal-50 py-20 lg:py-32">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxQTM2NUQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Research badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-6"
            >
              <Award className="h-4 w-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">Research-backed by Harvard/Perplexity 2026</span>
            </motion.div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-teal-600 leading-tight">
              Discover Your Business&apos;s
              <span className="block text-teal-700">AI Potential</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Take our <strong>free 3-minute assessment</strong> to uncover how affordable AI solutions can transform your business. <span className="font-semibold text-navy">57% of UK businesses</span> already use AI daily.
            </p>
            
            {/* Key stats row */}
            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow-sm">
                <TrendingUp className="h-4 w-4 text-teal" />
                <span className="text-sm font-medium text-navy"><strong>47%</strong> productivity gains</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 rounded-lg px-3 py-2 shadow-sm">
                <Clock className="h-4 w-4 text-teal" />
                <span className="text-sm font-medium text-navy"><strong>15-20 hours</strong> saved weekly</span>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/assessment">
                <Button size="lg" className="bg-teal hover:bg-teal-dark text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse-soft">
                  Start Your Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-navy-50 rounded-full mx-auto mb-2">
                  <Clock className="h-6 w-6 text-navy" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-600 font-medium">3 Minutes</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-teal-50 rounded-full mx-auto mb-2">
                  <Zap className="h-6 w-6 text-teal" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Instant Results</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-navy-50 rounded-full mx-auto mb-2">
                  <Target className="h-6 w-6 text-navy" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-gray-600 font-medium">Personalised</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-12 lg:mt-0"
          >
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl shadow-2xl overflow-hidden relative bg-gray-100">
                <Image 
                  src="/cloneexpert-hero.png"
                  alt="AI consultancy - woman with headphones working alongside AI assistant"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Floating cards */}
              <motion.div 
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-teal-100"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-teal" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-navy">AI Ready</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-navy-100"
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-teal" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-navy">ROI Focused</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Clock, Gift, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-navy to-navy-light text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRkZGRkYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iNCIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 text-teal-300">
            Ready to Unlock Your Business&apos;s AI Potential?
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-6">
            Join hundreds of UK SMEs, solopreneurs, and nonprofits who have discovered exactly how to implement affordable AI solutions that actually work.
          </p>
          <p className="text-xl text-teal-400 font-bold text-center mb-12">
            We do not just talk about AI. We prove it, and we do!
          </p>
          
          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Only 3 Minutes</div>
                <div className="text-gray-300 text-sm">Quick and easy</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <div className="font-semibold">100% Free</div>
                <div className="text-gray-300 text-sm">No hidden costs</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-teal rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-white" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <div className="font-semibold">Instant Results</div>
                <div className="text-gray-300 text-sm">Immediate access</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Link href="/assessment">
              <Button size="lg" className="bg-teal hover:bg-teal-dark text-white px-12 py-6 text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 group animate-pulse-soft">
                Start Your Free AI Assessment Now
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
              </Button>
            </Link>
            
            <p className="text-gray-300 text-sm max-w-md mx-auto">
              No email required to start | Instant personalised results | Download comprehensive report
            </p>
          </div>
          
          {/* Research-backed stat */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 bg-navy-dark/50 backdrop-blur-sm rounded-2xl p-6 border border-teal/20"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-teal-light" strokeWidth={1.5} />
              <p className="text-lg font-semibold">
                <strong className="text-teal-light">57%</strong> of UK businesses already use AI daily
              </p>
            </div>
            <p className="text-gray-300">
              While you are thinking about AI, your competitors are already implementing it. Take the assessment now and start your transformation today.
            </p>
            <p className="text-xs text-gray-400 mt-2 italic">Source: Harvard/Perplexity Research December 2025</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

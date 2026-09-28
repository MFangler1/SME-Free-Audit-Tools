'use client'

import { motion } from 'framer-motion'
import { CheckCircle, BarChart3, FileText, Lightbulb, Target, Download } from 'lucide-react'

const results = [
  {
    icon: BarChart3,
    title: "Your AI Readiness Score",
    description: "Get a personalised score (0-100) showing exactly where your business stands and what's possible."
  },
  {
    icon: Target,
    title: "Targeted AI Recommendations",
    description: "Receive specific, affordable AI solutions tailored to your industry, budget, and business goals."
  },
  {
    icon: Lightbulb,
    title: "Quick Win Opportunities",
    description: "Discover immediate automation opportunities that can save time and money starting this month."
  },
  {
    icon: FileText,
    title: "Comprehensive PDF Report",
    description: "Download a detailed action plan with implementation timelines and expected ROI calculations."
  },
  {
    icon: CheckCircle,
    title: "Implementation Roadmap",
    description: "Get a step-by-step guide showing exactly how to start your AI transformation journey."
  },
  {
    icon: Download,
    title: "Resource Library Access",
    description: "Unlock exclusive tools, templates, and guides to fast-track your AI implementation."
  }
]

export default function ResultsHook() {
  return (
    <section className="py-20 bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-teal-600 mb-6">
            Here's What You'll Discover
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            In just 3 minutes, you'll unlock a personalised roadmap to transform your business with affordable AI solutions.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-white rounded-xl p-6 border border-teal-100 hover:shadow-xl transition-all duration-300 hover:border-teal-200"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                    <result.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {result.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {result.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 bg-white rounded-2xl p-8 shadow-lg border border-teal-100"
        >
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-teal-600 mb-4">
              Plus, You'll Know Exactly What to Do Next
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              No more guessing or overwhelming research. You'll have a clear, actionable plan with specific steps, timeline, and budget requirements to start implementing AI in your business <strong>within 30 days</strong>.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, TrendingDown, Clock, PoundSterling, Users, Zap } from 'lucide-react'

const frustrations = [
  {
    icon: TrendingDown,
    title: "Falling Behind Competitors",
    description: "While 57% of UK businesses already use AI daily, you are still stuck with manual processes that drain time and resources."
  },
  {
    icon: Clock,
    title: "Overwhelming Operational Tasks",
    description: "Your team spends countless hours on repetitive work instead of focusing on growth and innovation."
  },
  {
    icon: PoundSterling,
    title: "Rising Costs, Shrinking Margins",
    description: "Labour costs keep climbing while efficiency stays flat, squeezing your bottom line every quarter."
  },
  {
    icon: Users,
    title: "Staff Burnout from Repetition",
    description: "Your best people are leaving because they are tired of mind-numbing, repetitive tasks."
  },
  {
    icon: Zap,
    title: "Missing Growth Opportunities",
    description: "You know AI could transform your business, but you do not know where to start or what is affordable."
  },
  {
    icon: AlertTriangle,
    title: "Complexity Paralysis",
    description: "Every AI solution seems too complex, expensive, or risky for your small to medium-sized business."
  }
]

export default function FrustrationHook() {
  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-teal-600 mb-6">
            Does This Sound Familiar?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            If you are running an SME, solopreneur venture, or nonprofit, you are likely facing these challenges every single day...
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {frustrations.map((frustration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group bg-teal-50 rounded-xl p-6 border border-teal-100 hover:shadow-lg transition-all duration-300 hover:bg-teal-100/50"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-700 transition-colors">
                    <frustration.icon className="h-6 w-6 text-white" strokeWidth={1.5} />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-navy mb-2 group-hover:text-teal-700 transition-colors">
                    {frustration.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {frustration.description}
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
          className="text-center mt-12"
        >
          <p className="text-2xl text-gray-700 font-medium">
            <span className="text-teal-600 font-bold">Stop struggling.</span> There is a better way forward.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

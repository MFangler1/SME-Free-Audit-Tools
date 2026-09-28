
'use client'

import { motion } from 'framer-motion'
import { Star, Award, CheckCircle, Building2, Briefcase, TrendingUp, Clock, PoundSterling, FileText, Users, Shield } from 'lucide-react'

const stats = [
  { number: "100+", label: "Organisations Assessed", icon: Building2 },
  { number: "47%", label: "Average Productivity Gains", icon: TrendingUp },
  { number: "15-20hrs", label: "Saved Weekly", icon: Clock },
  { number: "4.9/5", label: "Client Satisfaction", icon: Star }
]

const researchMetrics = [
  { metric: "57%", description: "of UK businesses now use AI daily", source: "Harvard/Perplexity 2025" },
  { metric: "47%", description: "productivity improvements in finance sectors", source: "arXiv:2512.07828" },
  { metric: "500M+", description: "users analysed in comprehensive AI study", source: "Perplexity Research Dec 2025" }
]

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "Founder, Local Marketing Co",
    quote: "The assessment opened our eyes to AI opportunities we never considered. We implemented their recommendations and saved 18 hours per week.",
    rating: 5
  },
  {
    name: "David Chen",
    title: "Operations Manager, Green Nonprofit",
    quote: "Finally, AI advice that makes sense for smaller organisations. The budget-friendly solutions actually work in the real world.",
    rating: 5
  },
  {
    name: "Lisa Rodriguez",
    title: "Solo Consultant",
    quote: "I was skeptical about AI for my one-person business. Now I am automating client reports and have 10 extra hours weekly for billable work.",
    rating: 5
  }
]

const certifications = [
  { name: "AI Business Strategy Certified", icon: Award },
  { name: "SME Technology Specialists", icon: CheckCircle },
  { name: "Nonprofit AI Implementation", icon: Briefcase }
]

export default function CredibilitySection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Research badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-6">
            <FileText className="h-4 w-4 text-teal-600" strokeWidth={1.5} />
            <span className="text-sm font-medium text-teal-700">Based on Harvard/Perplexity research December 2025</span>
          </div>
          
          <h2 className="text-3xl lg:text-5xl font-bold text-teal-600 mb-6">
            Trusted by UK SMEs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We specialise in affordable AI solutions for small and medium enterprises, solopreneurs, and nonprofits across the United Kingdom.
          </p>
        </motion.div>
        
        {/* Research-backed metrics */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-navy to-navy-light rounded-2xl p-8 mb-16 text-white"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-5 w-5 text-teal-light" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold">Research-Backed Insights</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {researchMetrics.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-teal-light mb-2">{item.metric}</div>
                <p className="text-gray-200 mb-2">{item.description}</p>
                <p className="text-xs text-gray-400 italic">Source: {item.source}</p>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-teal-200 transition-colors"
            >
              <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
              </div>
              <div className="text-3xl font-bold text-navy mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">&quot;{testimonial.quote}&quot;</p>
              <div>
                <div className="font-semibold text-navy">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Consultants info */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-teal-600 rounded-2xl p-8 mb-12 text-white"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="h-5 w-5 text-white" strokeWidth={1.5} />
            <h3 className="text-xl font-bold text-white">Your AI Consultant</h3>
          </div>
          <p className="text-center text-white max-w-2xl mx-auto mb-2">
            <strong>Mark Fenty</strong> — Consultant &amp; Founder
          </p>
          <p className="text-center text-white/90 max-w-2xl mx-auto mb-6">
            bringing decades of media, marketing &amp; AI consulting experience, helping UK businesses implement practical, affordable AI solutions.
          </p>
          <p className="text-center text-white font-bold">
            We do not just talk about AI. We prove it, and we do!
          </p>
        </motion.div>
        
        {/* Certifications */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-teal-600 mb-8">Our Credentials</h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center space-x-2 bg-white rounded-lg px-4 py-3 shadow border border-gray-100 hover:border-teal-200 transition-colors">
                <cert.icon className="h-5 w-5 text-teal" strokeWidth={1.5} />
                <span className="text-gray-700 font-medium">{cert.name}</span>
              </div>
            ))}
          </div>
          
          {/* Citation */}
          <p className="mt-8 text-xs text-gray-400 italic">
            Research citation: arXiv:2512.07828 - Analysis of 500M+ user interactions across AI platforms
          </p>
        </motion.div>
      </div>
    </section>
  )
}

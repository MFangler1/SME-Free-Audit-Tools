
'use client'

import { motion } from 'framer-motion'
import { Zap, PoundSterling, Clock, Shield, Users, TrendingUp, MessageSquare, Video, Bot, Sparkles } from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: "Save 15-20 Hours Per Week",
    description: "Automate repetitive tasks and free up your team for high-value work"
  },
  {
    icon: PoundSterling,
    title: "Reduce Operational Costs by 30%",
    description: "Cut expenses through intelligent automation and optimisation"
  },
  {
    icon: TrendingUp,
    title: "Boost Productivity by 47%",
    description: "Research-backed gains across finance, marketing, and operations sectors"
  },
  {
    icon: Users,
    title: "Improve Employee Satisfaction",
    description: "Eliminate boring tasks and let your team focus on creative work"
  },
  {
    icon: Shield,
    title: "Future-Proof Your Business",
    description: "Stay competitive with cutting-edge technology that grows with you"
  },
  {
    icon: Zap,
    title: "Start Seeing Results in 30 Days",
    description: "Quick implementation of high-impact AI solutions"
  }
]

const quickWins = [
  {
    icon: Bot,
    title: "AI Chatbot",
    price: "From £45/month",
    description: "24/7 customer service that never sleeps"
  },
  {
    icon: MessageSquare,
    title: "AI Call Handler",
    price: "From £45/month",
    description: "Never miss a call or enquiry again"
  },
  {
    icon: Video,
    title: "AI Video Intros",
    price: "From £45/month",
    description: "Professional videos in minutes"
  },
  {
    icon: Sparkles,
    title: "AI Digital Avatar",
    price: "From £45/month",
    description: "Your virtual brand ambassador"
  }
]

export default function ValueProposition() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-5xl font-bold text-teal-600 mb-6">
            Why Take This Assessment?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Because generic AI advice does not work. You need solutions designed specifically for your business size, industry, and budget constraints.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group text-center"
            >
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal transition-colors duration-300">
                <benefit.icon className="h-8 w-8 text-teal group-hover:text-white transition-colors" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
        
        {/* Quick Wins Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-teal-50 to-navy-50 rounded-3xl p-12 mb-16"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-teal-600 mb-4">
              Quick Wins from £45/month
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start seeing ROI immediately with these affordable AI solutions that deliver instant value to your business
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickWins.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all text-center"
              >
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-teal" strokeWidth={1.5} />
                </div>
                <h4 className="font-semibold text-navy mb-1">{item.title}</h4>
                <p className="text-teal font-bold text-sm mb-2">{item.price}</p>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-6">
            The Perfect Assessment for SMEs and Nonprofits
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-teal-light">3</div>
              <p className="text-gray-200">Minutes to complete</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-light">100%</div>
              <p className="text-gray-200">Free assessment</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-light">24/7</div>
              <p className="text-gray-200">Instant results</p>
            </div>
          </div>
          <p className="mt-8 text-xl text-gray-200 max-w-2xl mx-auto">
            Unlike expensive consultancy firms that charge thousands upfront, we believe in proving our value first. This assessment is our way of showing you exactly how we can help.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

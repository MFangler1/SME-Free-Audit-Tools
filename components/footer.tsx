
import Image from 'next/image'
import { Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="text-white py-12" style={{ backgroundColor: '#005994' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="relative h-12 w-12 mb-4">
              <Image
                src="/logo-teal-circle.png"
                alt="AiConsultancy Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-200 leading-relaxed">
              Empowering UK SMEs, solopreneurs, and nonprofits with affordable AI solutions that drive real business results.
            </p>
            <p className="text-teal-300 italic mt-2 text-sm">
              We do not just talk about AI. We prove it, and we do!
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-300">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-teal-300" strokeWidth={1.5} />
                <a href="mailto:Support@AiConsultancy.org.uk" className="text-gray-200 hover:text-teal-300 transition-colors">Support@AiConsultancy.org.uk</a>
              </div>
              <div className="text-gray-200">
                <strong className="text-white">Consultant &amp; Founder:</strong> Mark Fenty
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-teal-300">Our Mission</h3>
            <p className="text-gray-200 text-sm leading-relaxed">
              Making AI accessible and affordable for businesses of all sizes. We believe every organisation deserves to harness the power of artificial intelligence.
            </p>
            <p className="text-xs text-gray-300 mt-3 italic">
              Research-backed recommendations based on Harvard/Perplexity 2026 data
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-gray-200 text-sm">
            © 2026 AiConsultancy.org.uk. All rights reserved. | Professional AI Solutions for Modern UK Businesses
          </p>
        </div>
      </div>
    </footer>
  )
}

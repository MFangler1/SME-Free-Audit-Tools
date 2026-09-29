'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail, Users } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0D9488] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Column 1 - Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10">
                <Image src="/logo.png" alt="AiConsultancy.org.uk Logo" fill className="object-contain" />
              </div>
              <span className="text-lg font-semibold text-white">AiConsultancy</span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Empowering UK SMEs, solopreneurs, and nonprofits with affordable AI solutions that drive real business results.
            </p>
            <p className="text-white text-sm font-bold italic">
              We do not just talk about AI. We prove it, and we do!
            </p>
          </div>

          {/* Column 2 - Contact */}
          <div>
            <h4 className="text-white font-bold mb-4">Contact Information</h4>
            <div className="space-y-3">
              <a 
                href="mailto:Support@AiConsultancy.org.uk" 
                className="flex items-center gap-2 text-white font-bold hover:text-white transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Support@AiConsultancy.org.uk
              </a>
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Users className="w-4 h-4" />
                <span><strong className="text-white">Consultant &amp; Founder:</strong> Mark Fenty</span>
              </div>
            </div>
          </div>

          {/* Column 3 - Mission */}
          <div>
            <h4 className="text-white font-bold mb-4">Our Mission</h4>
            <p className="text-gray-300 text-sm mb-3">
              Making AI accessible and affordable for businesses of all sizes. We believe every organisation deserves to harness the power of artificial intelligence.
            </p>
            <p className="text-gray-400 text-xs italic">
              Research-backed recommendations based on Harvard/Perplexity 2025 data
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <p className="text-center text-white font-bold text-sm">
            © {currentYear} AiConsultancy.org.uk. All rights reserved. | Professional AI Solutions for Modern UK Businesses
          </p>
        </div>
      </div>
    </footer>
  );
}

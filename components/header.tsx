'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-[#0D9488] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10">
              <Image
                src="/logo.png"
                alt="AiConsultancy.org.uk Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-lg font-semibold text-[#0D9488] hidden sm:block">
              AiConsultancy
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Contact */}
            <a
              href="mailto:Support@AiConsultancy.org.uk"
              className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-[#0D9488] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Support@AiConsultancy.org.uk</span>
            </a>

            {/* Consultant */}
            <div className="hidden lg:flex items-center gap-1 text-sm text-gray-600">
              <span className="font-medium">Mark Fenty</span>
              <span>&middot; Consultant &amp; Founder</span>
            </div>

            {/* CTA Button */}
            <Link
              href="#audit-form"
              className="btn-coral px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
            >
              Start Assessment
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

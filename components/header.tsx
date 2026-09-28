
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-navy-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo-teal-circle.png"
                alt="AiConsultancy Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-bold text-lg text-teal-600">AiConsultancy</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4 text-teal" strokeWidth={1.5} />
              <a href="mailto:Support@AiConsultancy.org.uk" className="hover:text-teal-600 transition-colors">Support@AiConsultancy.org.uk</a>
            </div>
            <div className="text-gray-600">
              <span className="font-medium text-navy">Mark Fenty</span>
            </div>
            <Link href="/assessment">
              <Button className="bg-teal hover:bg-teal-dark text-white px-6">
                Start Assessment
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Link href="/assessment">
              <Button className="bg-teal hover:bg-teal-dark text-white">
                Start
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}


import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'AI Assessment Tool - Discover Your AI Readiness | AiConsultancy',
  description: 'Take our 3-minute free assessment to discover how your business can implement affordable AI solutions. Get personalised recommendations for SMEs and nonprofits.',
  keywords: 'AI assessment, artificial intelligence, business automation, SME AI solutions, AI readiness, business consulting',
  openGraph: {
    title: 'AI Assessment Tool - Discover Your AI Readiness',
    description: 'Take our 3-minute free assessment to discover how your business can implement affordable AI solutions.',
    url: '/',
    siteName: 'AiConsultancy',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

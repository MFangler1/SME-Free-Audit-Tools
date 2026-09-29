import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: 'AI Visibility Audit | AiConsultancy.org.uk',
  description: 'Discover why AI search engines can\'t find your business. Get your free AI Visibility Audit and learn how to become visible in ChatGPT, Perplexity, Claude, and Google AI Overviews.',
  keywords: 'AI search, AI visibility, ChatGPT SEO, AI optimization, structured data, schema markup, B2B services',
  authors: [{ name: 'AiConsultancy.org.uk' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  },
  openGraph: {
    title: 'AI Visibility Audit | AiConsultancy.org.uk',
    description: 'Discover why AI search engines can\'t find your business. Get your free AI Visibility Audit.',
    url: '/',
    siteName: 'AI Visibility Audit',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility Audit | AiConsultancy.org.uk',
    description: 'Discover why AI search engines can\'t find your business.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <Script src="https://apps.abacus.ai/chatllm/appllm-lib.js" strategy="afterInteractive" />
      </head>
      <body className="font-sans antialiased bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}

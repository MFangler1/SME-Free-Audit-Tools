
import { Suspense } from 'react'
import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import FrustrationHook from '@/components/frustration-hook'
import ResultsHook from '@/components/results-hook'
import ValueProposition from '@/components/value-proposition'
import CredibilitySection from '@/components/credibility-section'
import CTASection from '@/components/cta-section'
import Footer from '@/components/footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <HeroSection />
        <FrustrationHook />
        <ResultsHook />
        <ValueProposition />
        <CredibilitySection />
        <CTASection />
        <Footer />
      </Suspense>
    </main>
  )
}

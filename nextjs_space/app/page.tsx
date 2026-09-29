import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import AuditForm from '@/components/audit-form';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <HeroSection />
      <section id="audit-form" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <AuditForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
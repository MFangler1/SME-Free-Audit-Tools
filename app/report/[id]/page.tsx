import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import AuditReport from '@/components/audit-report';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function ReportPage({ params }: PageProps) {
  const audit = await prisma.audit.findUnique({ where: { id: params.id } });

  if (!audit || audit.status !== 'completed') {
    notFound();
  }

  const result = {
    id: audit.id,
    url: audit.url,
    businessName: audit.businessName || '',
    score: audit.score || 0,
    confidenceLevel: audit.confidenceLevel || 'Low',
    aiDescription: audit.aiDescription || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    analysisJson: (audit.analysisJson as any) || null,
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F0FDFA] to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <AuditReport result={result} />
      </div>
    </main>
  );
}

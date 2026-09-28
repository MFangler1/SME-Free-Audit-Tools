
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import ResultsDisplay from '@/components/results/results-display'

export const dynamic = "force-dynamic"

export const metadata = {
  title: 'Your AI Assessment Results - AiConsultancy',
  description: 'View your personalised AI readiness score and recommendations.',
}

interface ResultsPageProps {
  params: {
    id: string
  }
}

export default async function ResultsPage({ params }: ResultsPageProps) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id }
    })

    if (!assessment) {
      notFound()
    }

    return <ResultsDisplay assessment={assessment} />
  } catch (error) {
    console.error('Error fetching assessment:', error)
    notFound()
  }
}

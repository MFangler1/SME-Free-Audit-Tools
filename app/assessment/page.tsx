
import AssessmentFlow from '@/components/assessment/assessment-flow'

export const metadata = {
  title: 'AI Assessment Questionnaire - AiConsultancy',
  description: 'Complete your personalised AI readiness assessment in just 3 minutes.',
}

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <AssessmentFlow />
    </main>
  )
}

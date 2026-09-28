
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = "force-dynamic"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: params.id }
    })

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 })
    }

    const recommendations = JSON.parse(assessment.recommendations || '{}')
    
    // Create email content
    const emailSubject = `CLIENT - AI Assessment - ${assessment.companyName}`
    const emailBody = `
NEW AI ASSESSMENT SUBMISSION

Company Information:
- Company: ${assessment.companyName}
- Contact: ${assessment.fullName}
- Position: ${assessment.position}
- Website: ${assessment.companyUrl}
- Email: ${assessment.email || 'Not provided'}
- Phone: ${assessment.phoneNumber || 'Not provided'}

Assessment Details:
- Industry: ${assessment.industry}
- Team Size: ${assessment.teamSize}
- Budget Range: ${assessment.budgetRange}
- AI Awareness Level: ${assessment.aiAwareness.replace('-', ' ')}
- AI Readiness Score: ${assessment.readinessScore}/100

Business Processes of Interest:
${assessment.businessProcesses.split(',').map(process => `- ${process.replace('-', ' ')}`).join('\n')}

Pain Points:
${assessment.painPoints.split(',').map(point => `- ${point.replace('-', ' ')}`).join('\n')}

Additional Information:
${assessment.additionalInfo || 'None provided'}

Assessment Completed: ${new Date(assessment.createdAt).toLocaleDateString()} ${new Date(assessment.createdAt).toLocaleTimeString()}

Quick Wins Recommended:
${recommendations.quickWins ? recommendations.quickWins.map((win: any) => `- ${win.title}: ${win.description}`).join('\n') : 'None generated'}

Strategic Recommendations:
${recommendations.strategic ? recommendations.strategic.map((rec: any) => `- ${rec.title}: ${rec.description}`).join('\n') : 'None generated'}

---
This assessment was submitted through the AI Assessment Tool.
Assessment ID: ${assessment.id}
    `.trim()

    // In a real implementation, you would integrate with an email service like SendGrid, AWS SES, etc.
    // For this demo, we'll simulate the email sending and log the content
    console.log('=== EMAIL TO BE SENT ===')
    console.log('To: mark.fenty@Gmail.com')
    console.log('Subject:', emailSubject)
    console.log('Body:', emailBody)
    console.log('========================')

    // Update database to mark email as sent
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { emailSent: true }
    })

    // Simulate successful email sending
    return NextResponse.json({
      success: true,
      message: 'Assessment results emailed successfully'
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

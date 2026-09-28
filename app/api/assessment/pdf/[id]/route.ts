import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { topAITools, aiConsultancySolutions } from '@/lib/ai-tools'

export const dynamic = "force-dynamic"
export const maxDuration = 300

// Tool mapping for personalisation
function getPersonalisedTools(painPoints: string[], businessProcesses: string[]) {
  const toolScores: Map<string, number> = new Map()
  
  const toolMapping: Record<string, string[]> = {
    'ChatGPT': ['content-creation', 'slow-customer-response', 'customer-service', 'email-inbox'],
    'Claude': ['content-creation', 'data-analysis', 'document-processing', 'reports-documents'],
    'Zapier': ['time-consuming-tasks', 'data-entry', 'email-inbox', 'automation'],
    'Notion AI': ['reports-documents', 'project-management', 'content-creation'],
    'Canva': ['content-creation', 'social-media', 'inconsistent-quality'],
    'Grammarly': ['content-creation', 'email-inbox', 'inconsistent-quality'],
    'Otter.ai': ['meetings-notes', 'time-consuming-tasks'],
    'Calendly': ['appointments-calendar', 'slow-customer-response'],
    'HubSpot': ['sales-crm', 'slow-customer-response', 'missing-opportunities'],
    'Jasper': ['content-creation', 'social-media', 'competitors-faster'],
    'Descript': ['content-creation', 'social-media'],
    'Fireflies.ai': ['meetings-notes', 'time-consuming-tasks'],
    'Pictory': ['content-creation', 'social-media'],
    'ElevenLabs': ['content-creation', 'customer-service'],
    'Perplexity': ['data-analysis', 'content-creation', 'competitors-faster'],
    'Cursor': ['automation', 'time-consuming-tasks'],
    'Microsoft Copilot': ['reports-documents', 'email-inbox', 'data-analysis', 'content-creation']
  }
  
  const allSelected = [...painPoints, ...businessProcesses]
  
  topAITools.forEach(tool => {
    const triggers = toolMapping[tool.name] || []
    let score = 0
    triggers.forEach(trigger => {
      if (allSelected.includes(trigger)) score += 1
    })
    if (score > 0) toolScores.set(tool.name, score)
  })
  
  const sortedTools = topAITools
    .filter(tool => toolScores.has(tool.name))
    .sort((a, b) => (toolScores.get(b.name) || 0) - (toolScores.get(a.name) || 0))
    .slice(0, 8)
  
  if (sortedTools.length < 5) {
    const remaining = topAITools.filter(t => !sortedTools.find(s => s.name === t.name))
    sortedTools.push(...remaining.slice(0, 5 - sortedTools.length))
  }
  
  return sortedTools
}

// Get relevant AiConsultancy solutions
function getRelevantAiConsultancySolutions(painPoints: string[], businessProcesses: string[]) {
  const relevantSolutions: typeof aiConsultancySolutions = []
  
  const chatbotRelevant = ['slow-customer-response', 'customer-service', 'time-consuming-tasks', 'employee-burnout', 'scaling-difficulty']
  if (painPoints.some(p => chatbotRelevant.includes(p)) || businessProcesses.some(p => chatbotRelevant.includes(p))) {
    const solution = aiConsultancySolutions.find(s => s.name === 'AiCloneExpert')
    if (solution) relevantSolutions.push(solution)
  }
  
  const socialRelevant = ['content-creation', 'social-media', 'time-consuming-tasks', 'competitors-faster', 'inconsistent-quality']
  if (painPoints.some(p => socialRelevant.includes(p)) || businessProcesses.some(p => socialRelevant.includes(p))) {
    const solution = aiConsultancySolutions.find(s => s.name === 'MediaManagerPro')
    if (solution) relevantSolutions.push(solution)
  }
  
  const callRelevant = ['slow-customer-response', 'appointments-calendar', 'time-consuming-tasks', 'employee-burnout', 'missing-opportunities', 'sales-crm']
  if (painPoints.some(p => callRelevant.includes(p)) || businessProcesses.some(p => callRelevant.includes(p))) {
    const solution = aiConsultancySolutions.find(s => s.name === 'AiTaskNavigator')
    if (solution) relevantSolutions.push(solution)
  }
  
  return relevantSolutions
}

export async function GET(
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
    const scoreCategory = assessment.readinessScore >= 80 ? 'Excellent' : 
                         assessment.readinessScore >= 60 ? 'Good' : 
                         assessment.readinessScore >= 40 ? 'Moderate' : 'Developing'
    
    // Handle both JSON arrays and single string values
    let painPoints: string[] = []
    let businessProcesses: string[] = []
    
    try {
      const pp = assessment.painPoints || '[]'
      painPoints = pp.startsWith('[') ? JSON.parse(pp) : [pp]
    } catch {
      painPoints = assessment.painPoints ? [assessment.painPoints] : []
    }
    
    try {
      const bp = assessment.businessProcesses || '[]'
      businessProcesses = bp.startsWith('[') ? JSON.parse(bp) : [bp]
    } catch {
      businessProcesses = assessment.businessProcesses ? [assessment.businessProcesses] : []
    }
    
    const personalisedTools = getPersonalisedTools(painPoints, businessProcesses)
    const recommendedNow = personalisedTools.slice(0, 3)
    const considerLater = personalisedTools.slice(3, 8)
    const relevantSolutions = getRelevantAiConsultancySolutions(painPoints, businessProcesses)
    
    const generatedDate = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    })

    // Build HTML matching DOCX structure
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>AI Assessment Report - ${assessment.companyName}</title>
    <style>
        @page { margin: 1in 1in 0.75in 1in; }
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; color: #000; max-width: 800px; margin: 0 auto; padding: 20px; }
        .cover { text-align: center; page-break-after: always; padding-top: 100px; }
        .cover h1 { font-size: 28pt; color: #0D9488; margin-bottom: 10px; }
        .cover .subtitle { font-size: 14pt; color: #666; margin-bottom: 30px; }
        .cover .slogan { font-size: 12pt; color: #DC143C; font-style: italic; font-weight: bold; margin: 30px 0; }
        .cover .client-info { margin-top: 60px; font-size: 12pt; }
        h1 { font-size: 16pt; color: #000; margin-top: 24px; margin-bottom: 12px; }
        h2 { font-size: 14pt; color: #000; margin-top: 18px; margin-bottom: 10px; }
        h3 { font-size: 12pt; color: #0D9488; margin-top: 14px; margin-bottom: 8px; }
        .score-section { text-align: center; margin: 30px 0; page-break-after: always; }
        .score-number { font-size: 48pt; font-weight: bold; color: #0D9488; }
        .score-category { font-size: 18pt; color: #0D9488; margin: 10px 0; }
        .company-profile { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .quick-win { margin: 15px 0; padding: 12px; background: #f0fdfa; border-left: 3px solid #0D9488; }
        .quick-win h4 { margin: 0 0 8px 0; color: #000; }
        .implementation { color: #0D9488; font-size: 10pt; margin-top: 8px; }
        .pathway-box { border: 2px solid #0D9488; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .pathway-option { margin: 12px 0; padding-left: 20px; }
        .solution-card { margin: 15px 0; padding: 15px; background: #f0fdfa; border-radius: 8px; }
        .solution-card h4 { color: #0D9488; margin: 0 0 8px 0; }
        .solution-price { font-weight: bold; color: #000; }
        .tool-item { margin: 10px 0; padding: 10px; background: #fafafa; border-radius: 4px; }
        .tool-name { font-weight: bold; color: #000; }
        .tool-url { color: #0563C1; text-decoration: underline; }
        .footer { margin-top: 40px; padding: 20px; background: #0D9488; color: white; border-radius: 8px; text-align: center; }
        .footer a { color: white; }
        .disclaimer { font-size: 9pt; color: #666; margin-top: 30px; padding: 15px; background: #f5f5f5; border-radius: 4px; }
        a { color: #0563C1; }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="cover">
        <h1>AiConsultancy.org.uk</h1>
        <p class="subtitle">by Mark Fenty</p>
        <p class="slogan">We don't just talk about AI. We prove it, and we do!</p>
        <div class="client-info">
            <p><strong>AI Readiness Assessment Report</strong></p>
            <p>Prepared for: ${assessment.fullName}</p>
            <p>${assessment.companyName}</p>
            <p>Generated: ${generatedDate}</p>
        </div>
    </div>

    <!-- Score Section -->
    <div class="score-section">
        <h1>Your AI Readiness Score</h1>
        <div class="score-number">${assessment.readinessScore}/100</div>
        <div class="score-category">${scoreCategory} AI Readiness</div>
        <p>Based on your responses, your organisation shows ${scoreCategory.toLowerCase()} potential for AI implementation.</p>
        
        <div class="company-profile">
            <h2>Company Profile</h2>
            <p><strong>Industry:</strong> ${assessment.industry}</p>
            <p><strong>Team Size:</strong> ${assessment.teamSize}</p>
            <p><strong>Budget Range:</strong> ${assessment.budgetRange}</p>
            <p><strong>AI Experience:</strong> ${assessment.aiAwareness?.replace(/-/g, ' ') || 'Not specified'}</p>
        </div>
    </div>

    <!-- Quick Wins Section -->
    ${recommendations.quickWins && recommendations.quickWins.length > 0 ? `
    <h1>Quick Wins (Start This Month)</h1>
    <p><em>These are affordable AI solutions that can deliver measurable results within weeks, not months.</em></p>
    ${recommendations.quickWins.map((win: any, index: number) => `
    <div class="quick-win">
        <h4>${index + 1}. ${win.title}</h4>
        <p>${win.description}</p>
        <p><strong>Cost:</strong> ${win.cost} | <strong>Time:</strong> ${win.timeToImplement} | <strong>ROI:</strong> ${win.expectedRoi}</p>
        <p class="implementation"><strong>What we need from you:</strong> Access to relevant systems, 30 minutes for briefing</p>
        <p class="implementation"><strong>How we measure success:</strong> Time saved, response improvement, cost reduction</p>
    </div>
    `).join('')}
    ` : ''}

    <!-- Implementation Pathway -->
    <div class="pathway-box">
        <h2>Implementation Pathway</h2>
        <p><em>Choose the level of support that works for your business:</em></p>
        <div class="pathway-option"><strong>Option A: Do-it-yourself (free)</strong> - Use our recommendations and implement at your own pace with free tools.</div>
        <div class="pathway-option"><strong>Option B: Supported set-up (fixed fee)</strong> - We guide you through setup with training and templates. From £195.</div>
        <div class="pathway-option"><strong>Option C: Done-for-you (project/retainer)</strong> - Full implementation by our team. Pricing based on scope.</div>
        <p style="margin-top: 15px;"><strong>Not sure which option suits you?</strong> Book a short deep dive call to confirm which quick wins will deliver the best return for your business.</p>
    </div>

    <!-- AiConsultancy Solutions -->
    ${relevantSolutions.length > 0 ? `
    <h1>Affordable Solutions We Can Deliver</h1>
    <p><em>Based on your challenges, these are affordable solutions AiConsultancy can set up and manage for you.</em></p>
    ${relevantSolutions.map((solution, index) => `
    <div class="solution-card">
        <h4>${index + 1}. ${solution.name} <span class="solution-price">from ${solution.paidPlanStart}</span></h4>
        <p>${solution.description}</p>
        <p><strong>What you get:</strong></p>
        <ul>
            ${solution.keyFeatures.slice(0, 3).map(f => `<li>${f}</li>`).join('')}
        </ul>
        <p><strong>Website:</strong> <a href="${solution.url}" class="tool-url">${solution.url.replace('https://', '')}</a></p>
    </div>
    `).join('')}
    <p><em>These are ready-to-go solutions we manage for you. <strong>Ask about a bundled package during your deep dive call.</strong></em></p>
    ` : ''}

    <!-- Strategic Recommendations -->
    ${recommendations.strategic && recommendations.strategic.length > 0 ? `
    <h1>Strategic Recommendations (3-6 Months)</h1>
    ${recommendations.strategic.map((rec: any, index: number) => `
    <div class="quick-win">
        <h4>${index + 1}. ${rec.title}</h4>
        <p>${rec.description}</p>
        <p><strong>Investment:</strong> ${rec.investment} | <strong>Timeline:</strong> ${rec.timeline} | <strong>Impact:</strong> ${rec.impact}</p>
    </div>
    `).join('')}
    ` : ''}

    <!-- Long-term Vision -->
    ${recommendations.longTerm && recommendations.longTerm.length > 0 ? `
    <h1>Long-Term Vision (6+ Months)</h1>
    ${recommendations.longTerm.map((vision: any, index: number) => `
    <div class="quick-win">
        <h4>${index + 1}. ${vision.title}</h4>
        <p>${vision.description}</p>
    </div>
    `).join('')}
    ` : ''}

    <!-- Personalised Tool Recommendations -->
    <h1>Personalised Tool Recommendations</h1>
    <p><em>Based on your pain points and business processes, these tools are most relevant to your needs.</em></p>
    
    <h2>Recommended Now (Start With These)</h2>
    ${recommendedNow.map((tool, index) => `
    <div class="tool-item">
        <p class="tool-name">${index + 1}. ${tool.name}</p>
        <p>${tool.description}</p>
        <p><strong>Starting from:</strong> ${tool.freeTier ? 'Free tier available' : tool.paidPlanStart} | <a href="${tool.url}" class="tool-url">${tool.url.replace('https://', '')}</a></p>
    </div>
    `).join('')}

    ${considerLater.length > 0 ? `
    <h2>Consider Later</h2>
    ${considerLater.map((tool, index) => `
    <div class="tool-item">
        <p class="tool-name">${index + 1}. ${tool.name}</p>
        <p>${tool.description}</p>
        <p><strong>Starting from:</strong> ${tool.freeTier ? 'Free tier available' : tool.paidPlanStart} | <a href="${tool.url}" class="tool-url">${tool.url.replace('https://', '')}</a></p>
    </div>
    `).join('')}
    ` : ''}
    <p><em>For a complete list of AI tools, visit our tools library at AiConsultancy.org.uk</em></p>

    <!-- Contact Footer -->
    <div class="footer">
        <h2 style="color: white; margin-top: 0;">Ready to Transform Your Business?</h2>
        <p><strong>Mark Fenty</strong></p>
        <p>Website: <a href="https://AiConsultancy.org.uk">AiConsultancy.org.uk</a></p>
        <p>Email: <a href="mailto:Support@AiConsultancy.org.uk">Support@AiConsultancy.org.uk</a></p>
        <p style="margin-top: 15px;"><strong>Book a FREE 30-minute consultation:</strong><br/>
        <a href="https://tidycal.com/markfenty/30-minute-meeting">tidycal.com/markfenty/30-minute-meeting</a></p>
    </div>

    <!-- Disclaimer -->
    <div class="disclaimer">
        <strong>Disclaimer:</strong> This AI assessment report has been generated using artificial intelligence technology and is intended to provide general guidance and recommendations only. Whilst we strive for accuracy, AI-generated content may occasionally contain errors or recommendations that may not be suitable for your specific circumstances. We strongly advise consulting with our team before making business decisions based on this report. AiConsultancy.org.uk is not liable for actions taken based solely on this AI-generated report.
    </div>
</body>
</html>`

    // Generate PDF using HTML2PDF API
    const createResponse = await fetch('https://apps.abacus.ai/api/createConvertHtmlToPdfRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deployment_token: process.env.ABACUSAI_API_KEY,
        html_content: htmlContent,
        pdf_options: {
          format: 'A4',
          print_background: true,
          margin: { top: '1in', right: '1in', bottom: '0.75in', left: '1in' }
        }
      })
    })

    if (!createResponse.ok) {
      console.error('Failed to create PDF request')
      return NextResponse.json({ error: 'Failed to create PDF request' }, { status: 500 })
    }

    const { request_id } = await createResponse.json()
    if (!request_id) {
      return NextResponse.json({ error: 'No request ID returned' }, { status: 500 })
    }

    // Poll for status
    const maxAttempts = 60
    let attempts = 0

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const statusResponse = await fetch('https://apps.abacus.ai/api/getConvertHtmlToPdfStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id, deployment_token: process.env.ABACUSAI_API_KEY })
      })

      const statusResult = await statusResponse.json()
      const status = statusResult?.status || 'FAILED'
      const result = statusResult?.result || null

      if (status === 'SUCCESS' && result?.result) {
        const pdfBuffer = Buffer.from(result.result, 'base64')
        
        await prisma.assessment.update({
          where: { id: assessment.id },
          data: { reportGenerated: true }
        })

        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="AI-Assessment-Report-${assessment.companyName}.pdf"`
          }
        })
      } else if (status === 'FAILED') {
        console.error('PDF generation failed:', result?.error)
        return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
      }
      attempts++
    }

    return NextResponse.json({ error: 'PDF generation timed out' }, { status: 500 })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Failed to generate PDF report' }, { status: 500 })
  }
}

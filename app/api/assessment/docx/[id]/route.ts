
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { topAITools, aiConsultancySolutions } from '@/lib/ai-tools'
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  HeadingLevel,
  AlignmentType,
  UnderlineType,
  convertInchesToTwip,
  ExternalHyperlink,
  ImageRun,
  PageBreak,
  BorderStyle
} from 'docx'
import * as fs from 'fs'
import * as path from 'path'

export const dynamic = "force-dynamic"
export const maxDuration = 30

// Professional styling constants
const FONT = "Calibri"
const BODY_SIZE = 22 // 11pt (size is in half-points)
const H1_SIZE = 32 // 16pt
const H2_SIZE = 28 // 14pt
const H3_SIZE = 24 // 12pt
const SMALL_SIZE = 20 // 10pt
const BLACK = "000000"
const LINK_BLUE = "0563C1"
const TEAL = "0D9488"

// Spacing constants (in twentieths of a point)
const PARA_AFTER = 120 // 6pt
const PARA_AFTER_LARGE = 240 // 12pt
const H1_BEFORE = 240 // 12pt
const H1_AFTER = 240 // 12pt
const H2_BEFORE = 240 // 12pt
const H2_AFTER = 120 // 6pt
const H3_BEFORE = 120 // 6pt
const H3_AFTER = 60 // 3pt

// Tool mapping based on pain points and business processes
const toolMappings: Record<string, string[]> = {
  'time-consuming-tasks': ['ChatGPT', 'Zapier', 'Microsoft Copilot'],
  'rising-costs': ['Claude', 'Notion', 'Zapier'],
  'competitors-faster': ['Perplexity', 'ChatGPT', 'Cursor'],
  'employee-burnout': ['Fireflies.ai', 'Otter.ai', 'Slack'],
  'scaling-difficulty': ['Zapier', 'Notion', 'Microsoft Copilot'],
  'data-overload': ['Perplexity', 'Google NotebookLM', 'Claude'],
  'slow-customer-response': ['ChatGPT', 'Copy.ai', 'Slack'],
  'human-errors': ['Grammarly', 'Claude', 'Microsoft Copilot'],
  'missing-opportunities': ['Perplexity', 'Genspark', 'ChatGPT'],
  'security-compliance': ['Claude', 'Microsoft Copilot', 'Notion'],
  'inconsistent-quality': ['Grammarly', 'ChatGPT', 'Jasper'],
  'slow-decisions': ['Perplexity', 'Google NotebookLM', 'Claude'],
  'email-marketing': ['Copy.ai', 'ChatGPT', 'Jasper'],
  'content-creation': ['ChatGPT', 'Canva', 'Copy.ai'],
  'customer-service': ['ChatGPT', 'Claude', 'Slack'],
  'social-media': ['Canva', 'Copy.ai', 'Pictory'],
  'data-analysis': ['Claude', 'Perplexity', 'Microsoft Copilot'],
  'inventory-supply': ['Zapier', 'Microsoft Copilot', 'Notion'],
  'accounting-finance': ['Microsoft Copilot', 'Zapier', 'Claude'],
  'hr-recruitment': ['ChatGPT', 'Fireflies.ai', 'Notion'],
  'appointments-calendar': ['Zapier', 'Microsoft Copilot', 'Slack'],
  'sales-crm': ['ChatGPT', 'Zapier', 'Copy.ai'],
  'document-processing': ['Claude', 'Google NotebookLM', 'ChatGPT'],
  'security-compliance-process': ['Claude', 'Microsoft Copilot', 'Notion']
}

// Get personalised tool recommendations based on assessment data
function getPersonalisedTools(painPoints: string[], businessProcesses: string[]) {
  const toolScores: Record<string, number> = {}
  
  // Score tools based on pain points (higher weight)
  painPoints.forEach(painPoint => {
    const mappedTools = toolMappings[painPoint] || []
    mappedTools.forEach((tool, index) => {
      toolScores[tool] = (toolScores[tool] || 0) + (3 - index) * 2
    })
  })
  
  // Score tools based on business processes
  businessProcesses.forEach(process => {
    const mappedTools = toolMappings[process] || []
    mappedTools.forEach((tool, index) => {
      toolScores[tool] = (toolScores[tool] || 0) + (3 - index)
    })
  })
  
  // Sort tools by score and get top 8
  const sortedTools = Object.entries(toolScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name]) => topAITools.find(t => t.name === name))
    .filter(Boolean)
  
  // Fallback if not enough tools matched
  if (sortedTools.length < 5) {
    const defaultTools = ['ChatGPT', 'Claude', 'Zapier', 'Notion', 'Perplexity']
    defaultTools.forEach(name => {
      if (!sortedTools.find(t => t?.name === name)) {
        const tool = topAITools.find(t => t.name === name)
        if (tool && sortedTools.length < 8) sortedTools.push(tool)
      }
    })
  }
  
  return sortedTools as typeof topAITools
}

// Get relevant AiConsultancy solutions based on pain points and business processes
function getRelevantAiConsultancySolutions(painPoints: string[], businessProcesses: string[]) {
  const relevantSolutions: typeof aiConsultancySolutions = []
  
  // AiCloneExpert - for customer service and enquiry handling
  const chatbotRelevant = [
    'slow-customer-response', 'customer-service', 'time-consuming-tasks',
    'employee-burnout', 'scaling-difficulty'
  ]
  if (painPoints.some(p => chatbotRelevant.includes(p)) || 
      businessProcesses.some(p => chatbotRelevant.includes(p))) {
    const solution = aiConsultancySolutions.find(s => s.name === 'AiCloneExpert')
    if (solution) relevantSolutions.push(solution)
  }
  
  // MediaManagerPro - for social media and content
  const socialRelevant = [
    'content-creation', 'social-media', 'time-consuming-tasks',
    'competitors-faster', 'inconsistent-quality'
  ]
  if (painPoints.some(p => socialRelevant.includes(p)) || 
      businessProcesses.some(p => socialRelevant.includes(p))) {
    const solution = aiConsultancySolutions.find(s => s.name === 'MediaManagerPro')
    if (solution) relevantSolutions.push(solution)
  }
  
  // AiTaskNavigator - for call handling and automation
  const callRelevant = [
    'slow-customer-response', 'appointments-calendar', 'time-consuming-tasks',
    'employee-burnout', 'missing-opportunities', 'sales-crm'
  ]
  if (painPoints.some(p => callRelevant.includes(p)) || 
      businessProcesses.some(p => callRelevant.includes(p))) {
    const solution = aiConsultancySolutions.find(s => s.name === 'AiTaskNavigator')
    if (solution) relevantSolutions.push(solution)
  }
  
  return relevantSolutions
}

// Generate implementable details for quick wins
function getImplementationDetails(title: string, industry: string): { whatWeNeed: string; measureSuccess: string } {
  const titleLower = title.toLowerCase()
  
  // Map common quick win titles to specific implementation details
  if (titleLower.includes('email') || titleLower.includes('inbox')) {
    return {
      whatWeNeed: 'Access to your email platform or inbox, 30 minutes with one team member to understand current workflow.',
      measureSuccess: 'Response time reduced, number of emails handled automatically, hours saved per week.'
    }
  }
  if (titleLower.includes('customer') || titleLower.includes('support') || titleLower.includes('enquir')) {
    return {
      whatWeNeed: 'Access to your customer enquiry channel (website chat, social inbox, or email), sample FAQs and common questions.',
      measureSuccess: 'Response time improvement, customer satisfaction scores, enquiries handled without staff intervention.'
    }
  }
  if (titleLower.includes('content') || titleLower.includes('writing') || titleLower.includes('blog')) {
    return {
      whatWeNeed: 'Brand guidelines or tone of voice document, examples of content you like, 20 minutes to discuss topics.',
      measureSuccess: 'Content production time reduced, consistency of output, engagement metrics.'
    }
  }
  if (titleLower.includes('social') || titleLower.includes('media')) {
    return {
      whatWeNeed: 'Login access to social accounts or scheduling tool, brand assets (logos, images), content calendar preferences.',
      measureSuccess: 'Posts scheduled per week, time saved on content creation, engagement rates.'
    }
  }
  if (titleLower.includes('meeting') || titleLower.includes('transcri') || titleLower.includes('notes')) {
    return {
      whatWeNeed: 'Access to your video conferencing platform, permission to integrate transcription tool.',
      measureSuccess: 'Meeting summaries delivered automatically, action items captured, follow-up time reduced.'
    }
  }
  if (titleLower.includes('automat') || titleLower.includes('workflow') || titleLower.includes('process')) {
    return {
      whatWeNeed: 'Access to the tools involved in the workflow, 45 minutes to map current process with one team member.',
      measureSuccess: 'Manual steps eliminated, time saved per task, error rate reduction.'
    }
  }
  if (titleLower.includes('data') || titleLower.includes('report') || titleLower.includes('analy')) {
    return {
      whatWeNeed: 'Sample data files or access to data source, clarity on what insights you need, 30 minutes to discuss goals.',
      measureSuccess: 'Report generation time reduced, insights delivered faster, data accuracy improved.'
    }
  }
  if (titleLower.includes('document') || titleLower.includes('template')) {
    return {
      whatWeNeed: 'Sample documents or templates you currently use, branding guidelines, 20 minutes to discuss requirements.',
      measureSuccess: 'Document creation time reduced, consistency improved, reusable templates created.'
    }
  }
  if (titleLower.includes('sales') || titleLower.includes('lead') || titleLower.includes('crm')) {
    return {
      whatWeNeed: 'Access to your CRM or sales tool, sample sales scripts or follow-up sequences, 30 minutes with sales lead.',
      measureSuccess: 'Lead response time improved, follow-up rate increased, conversion tracking enabled.'
    }
  }
  if (titleLower.includes('schedul') || titleLower.includes('calendar') || titleLower.includes('booking')) {
    return {
      whatWeNeed: 'Access to your calendar or booking system, availability preferences, 15 minutes to configure.',
      measureSuccess: 'Booking time reduced, no-show rate, scheduling conflicts eliminated.'
    }
  }
  
  // Default for other quick wins
  return {
    whatWeNeed: 'Brief access to the relevant system or process, 30 minutes with one team member to understand current workflow.',
    measureSuccess: 'Time saved on the task, error reduction, measurable improvement in output quality.'
  }
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
    
    // Parse pain points and business processes for tool personalisation
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
    
    // Get personalised tool recommendations (max 8)
    const personalisedTools = getPersonalisedTools(painPoints, businessProcesses)
    const recommendedNow = personalisedTools.slice(0, 3)
    const considerLater = personalisedTools.slice(3, 8)
    
    // Get relevant AiConsultancy solutions
    const relevantSolutions = getRelevantAiConsultancySolutions(painPoints, businessProcesses)

    // Create document sections
    const sections: Paragraph[] = []

    // Try to load logo
    let mainLogoImage = null
    
    try {
      const mainLogoPath = path.join(process.cwd(), 'public', 'logo-teal-green-circle.png')
      if (fs.existsSync(mainLogoPath)) {
        const logoData = fs.readFileSync(mainLogoPath)
        mainLogoImage = new ImageRun({
          data: logoData,
          transformation: {
            width: 150,
            height: 150
          },
          type: "png"
        })
      }
    } catch (error) {
      console.error('Error loading main logo:', error)
    }

    // ============================================
    // COVER PAGE
    // ============================================

    // Logo (centered, 150px)
    if (mainLogoImage) {
      sections.push(
        new Paragraph({
          children: [mainLogoImage],
          alignment: AlignmentType.CENTER,
          spacing: { after: PARA_AFTER_LARGE }
        })
      )
    }

    // Title: AiConsultancy.org.uk
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "AiConsultancy.org.uk",
            font: FONT,
            bold: true,
            size: 48, // 24pt for main title
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      })
    )

    // Subtitle: AI Readiness Assessment Report
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "AI Readiness Assessment Report",
            font: FONT,
            size: H2_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      })
    )

    // Author: by Mark Fenty (italic)
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "by Mark Fenty",
            font: FONT,
            italics: true,
            size: H3_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // Client Information
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Prepared for: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.fullName, font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Company: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.companyName, font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Position: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.position || "Not specified", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Email: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: assessment.email || "Not provided",
                font: FONT,
                size: BODY_SIZE,
                color: LINK_BLUE,
                underline: { type: UnderlineType.SINGLE }
              })
            ],
            link: `mailto:${assessment.email || ""}`
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // Report Date (British format)
    const reportDate = new Date(assessment.createdAt).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: reportDate,
            font: FONT,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // ============================================
    // PAGE BREAK 1 - After Cover Page
    // ============================================
    sections.push(new Paragraph({ children: [new PageBreak()] }))

    // ============================================
    // YOUR AI READINESS SCORE
    // ============================================
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Your AI Readiness Score",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { before: H1_BEFORE, after: H1_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${assessment.readinessScore}/100`,
            font: FONT,
            bold: true,
            size: 72, // Large prominent score
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${scoreCategory} AI Readiness`,
            font: FONT,
            bold: true,
            size: H2_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER_LARGE }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Based on your responses, your business demonstrates ${scoreCategory.toLowerCase()} potential for AI implementation. This score reflects your current infrastructure, team readiness, and strategic alignment for adopting AI solutions.`,
            font: FONT,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // ============================================
    // PAGE BREAK 2 - After Score Section
    // ============================================
    sections.push(new Paragraph({ children: [new PageBreak()] }))

    // ============================================
    // COMPANY PROFILE
    // ============================================
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Company Profile",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { before: H1_BEFORE, after: H1_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• ", font: FONT, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "Industry: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.industry, font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• ", font: FONT, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "Team Size: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.teamSize, font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• ", font: FONT, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "Budget Range: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.budgetRange, font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• ", font: FONT, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "AI Experience Level: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: assessment.aiAwareness.replace('-', ' '), font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // ============================================
    // QUICK WINS (No page break - natural flow)
    // ============================================
    if (recommendations.quickWins && recommendations.quickWins.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Quick Wins: Immediate Action Items",
              font: FONT,
              bold: true,
              size: H1_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H1_BEFORE, after: H1_AFTER }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "These are practical improvements you can implement within the next 2 weeks. Each includes what we need from you and how we will measure success together.",
              font: FONT,
              italics: true,
              size: BODY_SIZE,
              color: BLACK
            })
          ],
          spacing: { after: PARA_AFTER_LARGE }
        })
      )

      recommendations.quickWins.forEach((win: any, index: number) => {
        // Generate implementable details based on the win type
        const implementationDetails = getImplementationDetails(win.title, assessment.industry)
        
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${win.title}`,
                font: FONT,
                bold: true,
                size: H3_SIZE,
                color: BLACK
              })
            ],
            spacing: { before: H3_BEFORE, after: H3_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: win.description, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Cost: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: win.cost, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "Time: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: win.timeToImplement, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "Expected ROI: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: win.expectedRoi, font: FONT, bold: true, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER }
          }),
          // NEW: What we need from you
          new Paragraph({
            children: [
              new TextRun({ text: "What we need from you: ", font: FONT, bold: true, size: BODY_SIZE, color: TEAL }),
              new TextRun({ text: implementationDetails.whatWeNeed, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER },
            indent: { left: convertInchesToTwip(0.25) }
          }),
          // NEW: How we measure success
          new Paragraph({
            children: [
              new TextRun({ text: "How we measure success: ", font: FONT, bold: true, size: BODY_SIZE, color: TEAL }),
              new TextRun({ text: implementationDetails.measureSuccess, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER_LARGE },
            indent: { left: convertInchesToTwip(0.25) }
          })
        )
      })

      // ============================================
      // IMPLEMENTATION PATHWAY BOX
      // ============================================
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Implementation Pathway",
              font: FONT,
              bold: true,
              size: H2_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H2_BEFORE, after: H2_AFTER }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Choose the level of support that works best for your business:",
              font: FONT,
              size: BODY_SIZE,
              color: BLACK
            })
          ],
          spacing: { after: PARA_AFTER }
        }),
        // Option A
        new Paragraph({
          children: [
            new TextRun({ text: "Option A: Do-it-yourself ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
            new TextRun({ text: "(free)", font: FONT, italics: true, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.25) }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Use this report as your roadmap. Follow the quick wins in order and implement at your own pace.", font: FONT, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: PARA_AFTER },
          indent: { left: convertInchesToTwip(0.5) }
        }),
        // Option B
        new Paragraph({
          children: [
            new TextRun({ text: "Option B: Supported set-up ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
            new TextRun({ text: "(fixed fee)", font: FONT, italics: true, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.25) }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "We guide you through implementation with training, templates, and check-in calls. You do the work with expert support.", font: FONT, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: PARA_AFTER },
          indent: { left: convertInchesToTwip(0.5) }
        }),
        // Option C
        new Paragraph({
          children: [
            new TextRun({ text: "Option C: Done-for-you implementation ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
            new TextRun({ text: "(project or retainer)", font: FONT, italics: true, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: 60 },
          indent: { left: convertInchesToTwip(0.25) }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "We handle everything from setup to staff training. You focus on running your business while we deliver results.", font: FONT, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: PARA_AFTER_LARGE },
          indent: { left: convertInchesToTwip(0.5) }
        }),
        // CTA
        new Paragraph({
          children: [
            new TextRun({ text: "Not sure which option suits you? ", font: FONT, size: BODY_SIZE, color: BLACK }),
            new TextRun({ text: "Book a short deep dive call to confirm which quick wins will deliver the best return for your business.", font: FONT, bold: true, size: BODY_SIZE, color: BLACK })
          ],
          spacing: { after: PARA_AFTER_LARGE }
        })
      )
    }

    // ============================================
    // AICONSULTANCY SOLUTIONS (Affordable options we deliver)
    // ============================================
    if (relevantSolutions.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Affordable Solutions We Can Deliver",
              font: FONT,
              bold: true,
              size: H1_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H1_BEFORE, after: H1_AFTER }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Based on your challenges, these are affordable solutions AiConsultancy can set up and manage for you. Each is designed for UK small businesses and includes full support.",
              font: FONT,
              italics: true,
              size: BODY_SIZE,
              color: BLACK
            })
          ],
          spacing: { after: PARA_AFTER_LARGE }
        })
      )

      relevantSolutions.forEach((solution, index) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${index + 1}. ${solution.name}`,
                font: FONT,
                bold: true,
                size: H3_SIZE,
                color: TEAL
              }),
              new TextRun({ 
                text: `  from ${solution.paidPlanStart}`,
                font: FONT,
                bold: true,
                size: BODY_SIZE,
                color: BLACK
              })
            ],
            spacing: { before: H3_BEFORE, after: H3_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: solution.description, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "What you get:", font: FONT, bold: true, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: 60 }
          })
        )
        
        // Add key features as bullet points
        solution.keyFeatures.slice(0, 3).forEach(feature => {
          sections.push(
            new Paragraph({
              children: [
                new TextRun({ text: `• ${feature}`, font: FONT, size: BODY_SIZE, color: BLACK })
              ],
              spacing: { after: 40 },
              indent: { left: convertInchesToTwip(0.25) }
            })
          )
        })

        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Website: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new ExternalHyperlink({
                children: [
                  new TextRun({ 
                    text: solution.url.replace('https://', ''),
                    font: FONT,
                    size: BODY_SIZE,
                    color: LINK_BLUE,
                    underline: { type: UnderlineType.SINGLE }
                  })
                ],
                link: solution.url
              })
            ],
            spacing: { after: PARA_AFTER_LARGE }
          })
        )
      })

      // Closing note for AiConsultancy solutions
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "These are ready-to-go solutions we manage for you. ",
              font: FONT,
              size: BODY_SIZE,
              color: BLACK
            }),
            new TextRun({
              text: "Ask about a bundled package during your deep dive call.",
              font: FONT,
              bold: true,
              size: BODY_SIZE,
              color: BLACK
            })
          ],
          spacing: { after: PARA_AFTER_LARGE }
        })
      )
    }

    // ============================================
    // STRATEGIC RECOMMENDATIONS (Natural flow)
    // ============================================
    if (recommendations.strategic && recommendations.strategic.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Strategic Recommendations",
              font: FONT,
              bold: true,
              size: H1_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H1_BEFORE, after: H1_AFTER }
        })
      )

      recommendations.strategic.forEach((rec: any, index: number) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${rec.title}`,
                font: FONT,
                bold: true,
                size: H3_SIZE,
                color: BLACK
              })
            ],
            spacing: { before: H3_BEFORE, after: H3_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: rec.description, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Investment: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: rec.investment, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "Timeline: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: rec.timeline, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "Impact: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: rec.impact, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "Priority: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: rec.priority, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER_LARGE }
          })
        )
      })
    }

    // ============================================
    // LONG-TERM VISION (Natural flow)
    // ============================================
    if (recommendations.longTerm && recommendations.longTerm.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Long-Term Vision",
              font: FONT,
              bold: true,
              size: H1_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H1_BEFORE, after: H1_AFTER }
        })
      )

      recommendations.longTerm.forEach((vision: any, index: number) => {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${index + 1}. ${vision.title}`,
                font: FONT,
                bold: true,
                size: H3_SIZE,
                color: BLACK
              })
            ],
            spacing: { before: H3_BEFORE, after: H3_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: vision.description, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER_LARGE }
          })
        )
      })
    }

    // ============================================
    // SUGGESTED TOOLS (Personalised shortlist)
    // ============================================
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Recommended Tools for Your Business",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { before: H1_BEFORE, after: H1_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Based on your specific challenges and business processes, we have selected these tools as the best starting points. This is a focused shortlist rather than an overwhelming catalogue.",
            font: FONT,
            italics: true,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // Recommended Now Section (top 3)
    if (recommendedNow.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Recommended now",
              font: FONT,
              bold: true,
              size: H2_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H2_BEFORE, after: H2_AFTER }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Start with these tools to address your most pressing challenges:",
              font: FONT,
              size: BODY_SIZE,
              color: BLACK
            })
          ],
          spacing: { after: PARA_AFTER }
        })
      )

      recommendedNow.forEach((tool, index) => {
        // Clean description by removing research citations
        const cleanDescription = tool.description
          .replace(/Per Harvard\/Perplexity 2026 research,?\s*/gi, '')
          .replace(/Per 2026 research,?\s*/gi, '')
          .replace(/Featured in 2026 research as\s*/gi, '')
          .replace(/Per Harvard 2026 research,?\s*/gi, '')
        
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${index + 1}. ${tool.name}`,
                font: FONT,
                bold: true,
                size: H3_SIZE,
                color: BLACK
              }),
              new TextRun({ 
                text: tool.freeTier ? '  (free tier available)' : '',
                font: FONT,
                italics: true,
                size: BODY_SIZE,
                color: BLACK
              })
            ],
            spacing: { before: H3_BEFORE, after: H3_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: cleanDescription, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Cost: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: tool.freeTier ? `Free to start, paid from ${tool.paidPlanStart}` : `From ${tool.paidPlanStart}`, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new ExternalHyperlink({
                children: [
                  new TextRun({ 
                    text: tool.url.replace('https://', ''),
                    font: FONT,
                    size: BODY_SIZE,
                    color: LINK_BLUE,
                    underline: { type: UnderlineType.SINGLE }
                  })
                ],
                link: tool.url
              })
            ],
            spacing: { after: PARA_AFTER_LARGE }
          })
        )
      })
    }

    // Consider Later Section (remaining tools)
    if (considerLater.length > 0) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Consider later",
              font: FONT,
              bold: true,
              size: H2_SIZE,
              color: BLACK
            })
          ],
          spacing: { before: H2_BEFORE, after: H2_AFTER }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Once your quick wins are in place, these tools can help you expand:",
              font: FONT,
              size: BODY_SIZE,
              color: BLACK
            })
          ],
          spacing: { after: PARA_AFTER }
        })
      )

      considerLater.forEach((tool, index) => {
        // Clean description by removing research citations
        const cleanDescription = tool.description
          .replace(/Per Harvard\/Perplexity 2026 research,?\s*/gi, '')
          .replace(/Per 2026 research,?\s*/gi, '')
          .replace(/Featured in 2026 research as\s*/gi, '')
          .replace(/Per Harvard 2026 research,?\s*/gi, '')
        
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ 
                text: `${index + 1}. ${tool.name}`,
                font: FONT,
                bold: true,
                size: H3_SIZE,
                color: BLACK
              }),
              new TextRun({ 
                text: tool.freeTier ? '  (free tier available)' : '',
                font: FONT,
                italics: true,
                size: BODY_SIZE,
                color: BLACK
              })
            ],
            spacing: { before: H3_BEFORE, after: H3_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: cleanDescription, font: FONT, size: BODY_SIZE, color: BLACK })
            ],
            spacing: { after: PARA_AFTER }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Cost: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: tool.freeTier ? `Free to start, paid from ${tool.paidPlanStart}` : `From ${tool.paidPlanStart}`, font: FONT, size: BODY_SIZE, color: BLACK }),
              new TextRun({ text: "  |  ", font: FONT, size: BODY_SIZE, color: BLACK }),
              new ExternalHyperlink({
                children: [
                  new TextRun({ 
                    text: tool.url.replace('https://', ''),
                    font: FONT,
                    size: BODY_SIZE,
                    color: LINK_BLUE,
                    underline: { type: UnderlineType.SINGLE }
                  })
                ],
                link: tool.url
              })
            ],
            spacing: { after: PARA_AFTER_LARGE }
          })
        )
      })
    }

    // Note about full tools library
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Looking for more options? ",
            font: FONT,
            italics: true,
            size: BODY_SIZE,
            color: BLACK
          }),
          new TextRun({
            text: "We maintain a comprehensive AI tools library on our website. Ask us during your deep dive call about tools for specific use cases.",
            font: FONT,
            italics: true,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // ============================================
    // CONTACT & NEXT STEPS
    // ============================================
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Next Steps",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { before: H1_BEFORE, after: H1_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ 
            text: "Ready to accelerate your AI journey? Book a complimentary consultation to discuss your personalised roadmap:",
            font: FONT,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Email: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: "Support@AiConsultancy.org.uk",
                font: FONT,
                size: BODY_SIZE,
                color: LINK_BLUE,
                underline: { type: UnderlineType.SINGLE }
              })
            ],
            link: "mailto:Support@AiConsultancy.org.uk"
          })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Book a call: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: "https://tidycal.com/markfenty/15-minute-meeting",
                font: FONT,
                size: BODY_SIZE,
                color: LINK_BLUE,
                underline: { type: UnderlineType.SINGLE }
              })
            ],
            link: "https://tidycal.com/markfenty/15-minute-meeting"
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // ============================================
    // DISCLAIMER (10pt, italic)
    // ============================================
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "Disclaimer",
            font: FONT,
            bold: true,
            size: SMALL_SIZE,
            color: BLACK
          })
        ],
        spacing: { before: 480, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `This report was prepared specifically for ${assessment.companyName}. The recommendations are based on the information provided during the assessment and general industry best practices. Results may vary based on implementation and specific business circumstances. We are not paid to feature any of the tools mentioned; recommendations are based on our expertise and research. For personalised guidance, please contact `,
            font: FONT,
            italics: true,
            size: SMALL_SIZE,
            color: BLACK
          }),
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: "Support@AiConsultancy.org.uk",
                font: FONT,
                italics: true,
                size: SMALL_SIZE,
                color: LINK_BLUE,
                underline: { type: UnderlineType.SINGLE }
              })
            ],
            link: "mailto:Support@AiConsultancy.org.uk"
          }),
          new TextRun({
            text: ".",
            font: FONT,
            italics: true,
            size: SMALL_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "© 2026 AiConsultancy.org.uk. All rights reserved.",
            font: FONT,
            italics: true,
            size: SMALL_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: PARA_AFTER_LARGE }
      })
    )

    // Create the document with professional margins
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: FONT,
              size: BODY_SIZE
            },
            paragraph: {
              spacing: {
                line: 276, // 1.15 line spacing
                before: 0,
                after: 0
              }
            }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(1)
            }
          }
        },
        children: sections
      }]
    })

    // Generate buffer
    const buffer = await Packer.toBuffer(doc)

    // Update database to mark report as generated
    await prisma.assessment.update({
      where: { id: assessment.id },
      data: { reportGenerated: true }
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="AI-Assessment-Report-${assessment.companyName.replace(/[^a-zA-Z0-9]/g, '-')}.docx"`
      }
    })

  } catch (error) {
    console.error('Error generating DOCX:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

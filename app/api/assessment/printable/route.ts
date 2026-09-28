
import { NextRequest, NextResponse } from 'next/server'
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  AlignmentType,
  convertInchesToTwip,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageBreak
} from 'docx'

export const dynamic = "force-dynamic"

// Styling constants
const FONT = "Calibri"
const BODY_SIZE = 22 // 11pt
const H1_SIZE = 32 // 16pt
const H2_SIZE = 28 // 14pt
const H3_SIZE = 24 // 12pt
const SMALL_SIZE = 20 // 10pt
const BLACK = "000000"
const BLUE = "0563C1"
const PARA_AFTER = 120
const PARA_AFTER_LARGE = 240

export async function GET(request: NextRequest) {
  try {
    const sections: (Paragraph | Table)[] = []
    const reportDate = new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })

    // ============================================
    // COVER PAGE
    // ============================================
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "AiConsultancy.org.uk",
            font: FONT,
            bold: true,
            size: 48,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "AI Readiness Assessment",
            font: FONT,
            size: 36,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Event Handout & Technical Reference",
            font: FONT,
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
            text: "by Mark Fenty",
            font: FONT,
            italics: true,
            size: H3_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER_LARGE * 2 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `Generated: ${reportDate}`,
            font: FONT,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: PARA_AFTER_LARGE }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "This document contains:",
            font: FONT,
            bold: true,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• All 8 Assessment Questions (conversion-optimised)", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Database Field Mapping (types and allowed values)", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Lead Scoring Rules", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "• Follow-up Sequence Recommendations", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // ============================================
    // PAGE BREAK - ASSESSMENT QUESTIONS
    // ============================================
    sections.push(new Paragraph({ children: [new PageBreak()] }))

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SECTION 1: Assessment Questions",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "3-Minute AI Readiness Assessment — Conversion-Optimised Questions",
            font: FONT,
            italics: true,
            size: BODY_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // STEP 1: Contact Information
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 1: Contact Information", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"Let's get started — we need some basic information to personalise your assessment results.\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Fields collected:", font: FONT, bold: true, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({ children: [new TextRun({ text: "• Full name *", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Position/Role *", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Company name *", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Company website *", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Email address (optional)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Additional information (optional)", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 2: AI Knowledge Level
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 2: AI Knowledge Level", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"What's your current AI knowledge level?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Options:", font: FONT, bold: true, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: 60 }
      }),
      new Paragraph({ children: [new TextRun({ text: "○ Complete beginner — \"I've heard about AI but don't really understand what it can do for my business.\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Basic understanding — \"I know AI exists and have some ideas about its potential, but haven't explored it seriously.\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Moderately informed — \"I've researched AI solutions and understand some use cases, but haven't implemented anything yet.\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Experienced user — \"I've already implemented some AI tools and am looking to expand or optimise our AI usage.\"", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 3: Business Processes
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 3: Business Processes", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"Which business processes could benefit from AI?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Instructions: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "Select all areas where you spend significant time on repetitive tasks.", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({ children: [new TextRun({ text: "Options (multi-select):", font: FONT, bold: true, size: BODY_SIZE })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Email Marketing & Campaigns", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Content Creation & Writing", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Customer Service & Support", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Social Media Management", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Data Analysis & Reporting", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Inventory & Supply Chain", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Accounting & Financial Tasks", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ HR & Recruitment", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Appointment & Calendar Management", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Sales & CRM Management", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Document Processing", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Security & Compliance", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 4: Budget
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 4: Budget", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"What's your budget for AI implementation?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({ children: [new TextRun({ text: "Options:", font: FONT, bold: true, size: BODY_SIZE })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "○ Under £500 per month — \"Looking for free or very low-cost solutions to get started\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ £500 to £2,000 per month — \"Ready to invest in proven AI solutions for key processes\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ £2,000 to £5,000 per month — \"Looking for advanced AI solutions and custom implementations\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Over £5,000 per month — \"Ready for comprehensive AI transformation with dedicated support\"", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 5: Team Size
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 5: Team Size & Technical Capability", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"What's your team size and technical capability?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({ children: [new TextRun({ text: "Options:", font: FONT, bold: true, size: BODY_SIZE })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "○ Just me (solopreneur) — \"I work alone and need solutions I can set up and manage myself\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Small team (2-10 people) — \"Small team with basic technical skills, prefer user-friendly solutions\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Medium team (11-50 people) — \"Established team with some technical expertise and dedicated IT support\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Large team (50+ people) — \"Large organisation with dedicated IT department and technical resources\"", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 6: Risk Assessment
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 6: Risk Assessment", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"How would you assess your AI adoption risk?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Instructions: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "Consider the impact of not adopting AI solutions on your business over the next 12 months.", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({ children: [new TextRun({ text: "Options:", font: FONT, bold: true, size: BODY_SIZE })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "○ High Risk — \"Our business faces significant challenges without AI adoption. We risk falling behind competitors and losing market share.\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Medium Risk — \"We see opportunities for improvement but can manage without immediate AI adoption. Some inefficiencies exist.\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Low Risk — \"Our current processes are working well. AI would be nice to have but is not urgent for our operations.\"", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 7: Pain Points
    sections.push(
      new Paragraph({ children: [new PageBreak()] }),
      new Paragraph({
        children: [
          new TextRun({ text: "Step 7: Business Challenges (Pain Points)", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"What are your biggest business challenges?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({ children: [new TextRun({ text: "Options (multi-select):", font: FONT, bold: true, size: BODY_SIZE })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Too much time on repetitive tasks (High impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Rising operational costs (High impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Competitors moving faster (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Employee burnout and turnover (High impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Difficulty scaling operations (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Drowning in data (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Slow customer response times (High impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Frequent human errors (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Missing growth opportunities (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Security and compliance risks (High impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Inconsistent work quality (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "☐ Slow decision making (Medium impact)", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // STEP 8: Industry
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Step 8: Industry Sector", font: FONT, bold: true, size: H2_SIZE, color: BLACK })
        ],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Question: ", font: FONT, bold: true, size: BODY_SIZE, color: BLACK }),
          new TextRun({ text: "\"What industry are you in?\"", font: FONT, size: BODY_SIZE, color: BLACK })
        ],
        spacing: { after: PARA_AFTER }
      }),
      new Paragraph({ children: [new TextRun({ text: "Options:", font: FONT, bold: true, size: BODY_SIZE })], spacing: { after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "○ Technology & Software (High AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ E-commerce & Retail (High AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Healthcare & Medical (Medium AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Education & Training (Medium AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Professional Services (High AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Manufacturing & Logistics (Medium AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Real Estate & Property (Medium AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Nonprofit & NGO (Low AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Trades & Field Services (Low AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Creative & Media (High AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Hospitality & Food Service (Medium AI potential)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "○ Other Industry", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // ============================================
    // PAGE BREAK - DATABASE FIELD MAPPING
    // ============================================
    sections.push(new Paragraph({ children: [new PageBreak()] }))

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SECTION 2: Database Field Mapping",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // Contact Fields
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "Contact Information Fields", font: FONT, bold: true, size: H2_SIZE, color: BLACK })],
        spacing: { after: PARA_AFTER }
      })
    )

    const contactFields = [
      ["fullName", "String", "Required", "Free text", "John Smith"],
      ["position", "String", "Required", "Free text", "CEO, Manager, Founder"],
      ["companyName", "String", "Required", "Free text", "Acme Ltd"],
      ["companyUrl", "String", "Required", "URL format", "https://example.com"],
      ["email", "String?", "Optional", "Email format", "john@example.com"],
      ["phoneNumber", "String?", "Optional", "Free text", "+44 7700 900000"],
      ["additionalInfo", "String?", "Optional", "Free text (textarea)", "Additional context..."]
    ]

    sections.push(createTable(["Field Name", "Type", "Required", "Validation", "Example"], contactFields))

    // Assessment Response Fields
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "Assessment Response Fields", font: FONT, bold: true, size: H2_SIZE, color: BLACK })],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      })
    )

    const assessmentFields = [
      ["aiAwareness", "String", "Required", "Single select", "no-knowledge | basic-knowledge | moderate-knowledge | experienced"],
      ["businessProcesses", "String (JSON)", "Required", "Multi-select array", "[\"email-marketing\", \"content-creation\", ...]"],
      ["budgetRange", "String", "Required", "Single select", "under-500 | 500-2000 | 2000-5000 | over-5000"],
      ["teamSize", "String", "Required", "Single select", "solo | small-team | medium-team | large-team"],
      ["riskLevel", "String?", "Optional", "Single select", "high-risk | medium-risk | low-risk"],
      ["painPoints", "String (JSON)", "Required", "Multi-select array", "[\"time-consuming-tasks\", \"rising-costs\", ...]"],
      ["industry", "String", "Required", "Single select", "technology | ecommerce | healthcare | ..."]
    ]

    sections.push(createTable(["Field Name", "Type", "Required", "Format", "Allowed Values"], assessmentFields))

    // Results Fields
    sections.push(
      new Paragraph({
        children: [new TextRun({ text: "Results & Output Fields", font: FONT, bold: true, size: H2_SIZE, color: BLACK })],
        spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER }
      })
    )

    const resultsFields = [
      ["readinessScore", "Int", "Calculated", "0-100", "AI-generated readiness score"],
      ["recommendations", "String (JSON)", "Calculated", "JSON object", "{ quickWins: [], strategic: [], longTerm: [] }"],
      ["reportGenerated", "Boolean", "System", "true/false", "Tracks if DOCX was downloaded"],
      ["emailSent", "Boolean", "System", "true/false", "Tracks if notification sent"]
    ]

    sections.push(createTable(["Field Name", "Type", "Source", "Range/Format", "Description"], resultsFields))

    // ============================================
    // PAGE BREAK - LEAD SCORING RULES
    // ============================================
    sections.push(new Paragraph({ children: [new PageBreak()] }))

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SECTION 3: Lead Scoring Rules",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      }),
      new Paragraph({
        children: [new TextRun({ text: "Lead Score Calculation (0-100 points)", font: FONT, bold: true, size: H2_SIZE, color: BLACK })],
        spacing: { after: PARA_AFTER }
      })
    )

    // Budget Score
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "Budget Score (Max 25 points)", font: FONT, bold: true, size: H3_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "• Under £500/month: 5 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• £500-£2,000/month: 15 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• £2,000-£5,000/month: 20 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Over £5,000/month: 25 points", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // Team Size Score
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "Team Size Score (Max 20 points)", font: FONT, bold: true, size: H3_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "• Solopreneur: 5 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Small team (2-10): 10 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Medium team (11-50): 15 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Large team (50+): 20 points", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // Risk Level Score
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "Risk Level Score (Max 25 points)", font: FONT, bold: true, size: H3_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "• High Risk: 25 points (urgent need — prioritise)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Medium Risk: 15 points (interested — nurture)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Low Risk: 5 points (long-term prospect)", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // Industry Score
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "Industry AI Potential Score (Max 15 points)", font: FONT, bold: true, size: H3_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "• High AI potential industries: 15 points (Technology, E-commerce, Professional Services, Creative)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Medium AI potential industries: 10 points (Healthcare, Education, Manufacturing, Real Estate, Hospitality)", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• Emerging AI potential industries: 5 points (Nonprofit, Trades)", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // Pain Points Score
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "Pain Points Score (Max 15 points)", font: FONT, bold: true, size: H3_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: 60 } }),
      new Paragraph({ children: [new TextRun({ text: "• 1-3 pain points selected: 5 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• 4-6 pain points selected: 10 points", font: FONT, size: BODY_SIZE })], spacing: { after: 40 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• 7+ pain points selected: 15 points", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Bonus: +2 points for each \"High impact\" pain point selected", font: FONT, italics: true, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // Lead Categories
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "Lead Categories", font: FONT, bold: true, size: H2_SIZE, color: BLACK })], spacing: { before: PARA_AFTER_LARGE, after: PARA_AFTER } }),
      new Paragraph({ children: [new TextRun({ text: "• HOT LEAD (75-100 points): Contact within 24 hours. High budget, urgent need, high-potential industry.", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• WARM LEAD (50-74 points): Contact within 48-72 hours. Medium budget, moderate interest.", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• COOL LEAD (25-49 points): Add to nurture sequence. Lower budget or lower urgency.", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "• COLD LEAD (0-24 points): Long-term nurture. Education-focused content.", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // ============================================
    // PAGE BREAK - FOLLOW-UP SEQUENCES
    // ============================================
    sections.push(new Paragraph({ children: [new PageBreak()] }))

    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SECTION 4: Follow-up Sequence Recommendations",
            font: FONT,
            bold: true,
            size: H1_SIZE,
            color: BLACK
          })
        ],
        spacing: { after: PARA_AFTER_LARGE }
      })
    )

    // HOT LEAD sequence
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "HOT LEAD Follow-up Sequence (75-100 points)", font: FONT, bold: true, size: H2_SIZE, color: BLACK })], spacing: { after: PARA_AFTER } }),
      new Paragraph({ children: [new TextRun({ text: "Day 0 (Immediate): Personalised email with assessment summary + calendar link for 15-minute call", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 1: Phone call attempt (if no booking)", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 2: Follow-up email with relevant case study from their industry", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 4: \"Quick Win\" email — specific tool recommendation based on their pain points", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 7: Final outreach — limited-time offer for free implementation consultation", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // WARM LEAD sequence
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "WARM LEAD Follow-up Sequence (50-74 points)", font: FONT, bold: true, size: H2_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: PARA_AFTER } }),
      new Paragraph({ children: [new TextRun({ text: "Day 0: Automated email with assessment results + \"Top 3 Recommendations\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 3: Email with free resource (guide/checklist) relevant to their industry", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 7: \"Others in [Industry] are doing this...\" social proof email", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 14: Invitation to free AI webinar or group workshop", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 21: \"Check in\" email — any questions about your assessment?", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 30: Move to monthly newsletter if no engagement", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // COOL LEAD sequence
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "COOL LEAD Follow-up Sequence (25-49 points)", font: FONT, bold: true, size: H2_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: PARA_AFTER } }),
      new Paragraph({ children: [new TextRun({ text: "Day 0: Automated email with assessment results + link to free AI tools guide", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 7: Educational email — \"AI basics for [their industry]\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 21: Case study email showing ROI from similar business", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 45: \"AI trends in 2026\" update email", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Ongoing: Add to monthly newsletter", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // COLD LEAD sequence
    sections.push(
      new Paragraph({ children: [new TextRun({ text: "COLD LEAD Follow-up Sequence (0-24 points)", font: FONT, bold: true, size: H2_SIZE, color: BLACK })], spacing: { before: PARA_AFTER, after: PARA_AFTER } }),
      new Paragraph({ children: [new TextRun({ text: "Day 0: Automated email with assessment results + beginner's AI guide", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Day 14: \"Free AI tools you can try today\" email", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Month 2: Re-engagement email — \"Ready to revisit AI?\"", font: FONT, size: BODY_SIZE })], spacing: { after: 60 }, indent: { left: convertInchesToTwip(0.25) } }),
      new Paragraph({ children: [new TextRun({ text: "Ongoing: Quarterly educational content only", font: FONT, size: BODY_SIZE })], spacing: { after: PARA_AFTER_LARGE }, indent: { left: convertInchesToTwip(0.25) } })
    )

    // Footer
    sections.push(
      new Paragraph({
        children: [
          new TextRun({ text: "\n\n—————————————————————————————————\n\n", font: FONT, size: SMALL_SIZE, color: BLACK })
        ],
        alignment: AlignmentType.CENTER
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "Contact: Support@AiConsultancy.org.uk | https://AiConsultancy.org.uk", font: FONT, size: SMALL_SIZE, color: BLUE })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 }
      }),
      new Paragraph({
        children: [
          new TextRun({ text: "© 2026 AiConsultancy.org.uk — Confidential Internal Document", font: FONT, italics: true, size: SMALL_SIZE, color: BLACK })
        ],
        alignment: AlignmentType.CENTER
      })
    )

    // Create the document
    const doc = new Document({
      styles: {
        default: {
          document: {
            run: { font: FONT, size: BODY_SIZE },
            paragraph: { spacing: { line: 276 } }
          }
        }
      },
      sections: [{
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75)
            }
          }
        },
        children: sections
      }]
    })

    const buffer = await Packer.toBuffer(doc)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="AI-Assessment-Event-Handout-${reportDate.replace(/ /g, '-')}.docx"`
      }
    })

  } catch (error) {
    console.error('Error generating printable document:', error)
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}

function createTable(headers: string[], rows: string[][]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: headers.map(header => 
          new TableCell({
            children: [new Paragraph({ 
              children: [new TextRun({ text: header, font: "Calibri", bold: true, size: 20 })],
              spacing: { after: 60 }
            })],
            width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
            shading: { fill: "E0E0E0" },
            margins: { top: 60, bottom: 60, left: 80, right: 80 }
          })
        )
      }),
      ...rows.map(row => 
        new TableRow({
          children: row.map(cell => 
            new TableCell({
              children: [new Paragraph({ 
                children: [new TextRun({ text: cell, font: "Calibri", size: 18 })],
                spacing: { after: 40 }
              })],
              width: { size: Math.floor(100 / headers.length), type: WidthType.PERCENTAGE },
              margins: { top: 40, bottom: 40, left: 80, right: 80 },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
              }
            })
          )
        })
      )
    ]
  })
}
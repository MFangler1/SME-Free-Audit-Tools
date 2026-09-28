
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { appendToGoogleSheets } from '@/lib/google-sheets'

export const dynamic = "force-dynamic"

interface AssessmentSubmission {
  fullName: string
  position: string
  companyName: string
  companyUrl: string
  email?: string
  phoneNumber?: string
  additionalInfo?: string
  aiAwareness: string
  businessProcesses: string[]
  budgetRange: string
  teamSize: string
  riskLevel?: string
  painPoints: string[]
  industry: string
}

export async function POST(request: NextRequest) {
  try {
    const data: AssessmentSubmission = await request.json()

    // Calculate AI Readiness Score
    let score = 0
    
    // AI Awareness scoring (0-25 points)
    const awarenessScores: { [key: string]: number } = {
      'no-knowledge': 5,
      'basic-knowledge': 10,
      'moderate-knowledge': 18,
      'experienced': 25
    }
    score += awarenessScores[data.aiAwareness] || 0

    // Business processes scoring (0-20 points)
    score += Math.min(data.businessProcesses.length * 2, 20)

    // Budget scoring (0-20 points)
    const budgetScores: { [key: string]: number } = {
      'under-500': 8,
      '500-2000': 15,
      '2000-5000': 18,
      'over-5000': 20
    }
    score += budgetScores[data.budgetRange] || 0

    // Team size scoring (0-15 points)
    const teamScores: { [key: string]: number } = {
      'solo': 8,
      'small-team': 12,
      'medium-team': 15,
      'large-team': 15
    }
    score += teamScores[data.teamSize] || 0

    // Pain points scoring (0-15 points)
    score += Math.min(data.painPoints.length * 1.5, 15)

    // Industry scoring (0-5 points)
    const industryScores: { [key: string]: number } = {
      'technology': 5,
      'ecommerce': 5,
      'professional-services': 5,
      'creative': 5,
      'healthcare': 4,
      'education': 4,
      'manufacturing': 4,
      'real-estate': 4,
      'hospitality': 4,
      'nonprofit': 3,
      'trades': 3,
      'other': 3
    }
    score += industryScores[data.industry] || 0

    const finalScore = Math.min(Math.round(score), 100)

    // Sector-specific quick win templates
    const sectorQuickWins: { [key: string]: string } = {
      'technology': 'Focus on code assistants (GitHub Copilot), automated testing, and CI/CD optimisation tools.',
      'ecommerce': 'Prioritise chatbots for customer service, AI-powered product recommendations, and inventory forecasting.',
      'professional-services': 'Emphasise document automation, AI-enhanced CRM, and meeting transcription tools.',
      'creative': 'Highlight AI design tools (Canva AI, Midjourney), content generation, and video editing automation.',
      'healthcare': 'Focus on appointment scheduling AI, patient communication automation, and administrative task reduction.',
      'education': 'Recommend AI tutoring assistants, content creation for courses, and automated grading tools.',
      'manufacturing': 'Emphasise predictive maintenance, quality control automation, and supply chain optimisation.',
      'real-estate': 'Prioritise property valuation AI, automated listing creation, and virtual tour generation.',
      'hospitality': 'Focus on booking automation, AI concierge chatbots, and review management tools.',
      'nonprofit': 'Highlight donor management AI, grant writing assistance, and volunteer coordination automation.',
      'trades': 'Recommend scheduling and dispatch AI, quote generation automation, and inventory management.',
      'other': 'Focus on general productivity tools like ChatGPT, Zapier automation, and AI-powered analytics.'
    }

    // Generate AI recommendations using LLM
    const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{
          role: 'system',
          content: `You are an AI business consultant for AiConsultancy.org.uk, specialising in affordable AI solutions for UK SMEs, solopreneurs, and nonprofits.

          RESEARCH CONTEXT (Harvard/Perplexity December 2025):
          - 57% of UK businesses now use AI daily
          - 47% productivity improvement in finance and professional services
          - 15-20 hours saved weekly is typical for small businesses implementing AI
          - Quick wins from £45/month are achievable (AI chatbots, call handlers, video intros, digital avatars)

          YOU MUST respond ONLY with valid JSON. No markdown, no code blocks, no text before or after the JSON.

          Required JSON structure:
          {
            "quickWins": [
              {
                "title": "Tool or Solution Name",
                "description": "Brief description of what it does and why it is recommended (2-3 sentences). Reference research-backed ROI where applicable.",
                "cost": "Cost range in British pounds (e.g., 'Free', '£10/month', 'From £45/month')",
                "timeToImplement": "Implementation time (e.g., '1 week', '2 to 3 days')",
                "expectedRoi": "Expected return (e.g., 'Save 5-10 hours per week', '47% productivity gain', '30% cost reduction')"
              }
            ],
            "strategic": [
              {
                "title": "Strategic Initiative Name",
                "description": "Detailed explanation of the recommendation (3-4 sentences). Include specific UK-relevant benefits and research-backed metrics where possible.",
                "investment": "Required investment range in British pounds (use realistic UK pricing)",
                "timeline": "Implementation timeline (e.g., '3 to 6 months')",
                "impact": "Expected business impact with specific metrics",
                "priority": "High"
              }
            ],
            "longTerm": [
              {
                "title": "Long-term Vision Item",
                "description": "Future possibility explanation (2-3 sentences) focusing on competitive advantage and growth potential."
              }
            ]
          }

          SECTOR-SPECIFIC GUIDANCE:
          ${sectorQuickWins[data.industry] || sectorQuickWins['other']}

          CRITICAL GUIDELINES:
          1. Provide 3 quick wins, 3 strategic recommendations, and 2 long-term items
          2. Match solutions to their budget (${data.budgetRange}) and team size (${data.teamSize})
          3. Directly address their specific pain points
          4. Use British English spelling throughout (optimise, analyse, organisation, colour, centre)
          5. All costs MUST be in British pounds (£) - no dollar signs ever
          6. Be specific, actionable, and realistic for UK SMEs
          7. Reference the £45/month quick win services where appropriate (chatbots, call handlers, video intros, avatars)
          8. Include ROI metrics based on research (47% productivity gains, 15-20 hours saved weekly)
          9. Priority for strategic items: "High", "Medium", or "Low"
          10. Avoid jargon - use plain English suitable for business owners

          IMPORTANT: Return ONLY the JSON object. No additional text, explanations, or formatting.`
        }, {
          role: 'user',
          content: `Generate AI recommendations for this UK business assessment:
          
          Company: ${data.companyName}
          Industry: ${data.industry}
          Team Size: ${data.teamSize}
          Budget: ${data.budgetRange}
          AI Awareness Level: ${data.aiAwareness}
          Business Processes They Want to Improve: ${data.businessProcesses.join(', ')}
          Key Pain Points: ${data.painPoints.join(', ')}
          AI Readiness Score: ${finalScore}/100
          Additional Context: ${data.additionalInfo || 'None provided'}
          
          Focus on practical, affordable solutions that can deliver ROI within weeks, not months. Remember this is a UK business so use British English and £ currency throughout.`
        }],
        response_format: { type: "json_object" },
        max_tokens: 2500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`)
    }

    const aiResponse = await response.json()
    let recommendationsContent = aiResponse.choices[0].message.content
    
    // Validate and parse the JSON response
    let parsedRecommendations
    try {
      // Remove any markdown code blocks if present
      recommendationsContent = recommendationsContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      parsedRecommendations = JSON.parse(recommendationsContent)
      
      // Validate structure
      if (!parsedRecommendations.quickWins || !Array.isArray(parsedRecommendations.quickWins)) {
        throw new Error('Invalid recommendations structure: missing quickWins array')
      }
      if (!parsedRecommendations.strategic || !Array.isArray(parsedRecommendations.strategic)) {
        throw new Error('Invalid recommendations structure: missing strategic array')
      }
      if (!parsedRecommendations.longTerm || !Array.isArray(parsedRecommendations.longTerm)) {
        throw new Error('Invalid recommendations structure: missing longTerm array')
      }
      
      // Store as string for database
      recommendationsContent = JSON.stringify(parsedRecommendations)
    } catch (parseError) {
      console.error('Failed to parse LLM recommendations:', parseError)
      console.error('Raw content:', recommendationsContent)
      
      // Fallback to default recommendations
      parsedRecommendations = {
        quickWins: [
          {
            title: "ChatGPT for Business Communications",
            description: "Use ChatGPT to draft emails, create content, and automate routine communications. This tool can significantly reduce time spent on repetitive writing tasks.",
            cost: "Free tier available, £16/month for ChatGPT Plus",
            timeToImplement: "1 to 2 days",
            expectedRoi: "Save 5 to 10 hours per week on communication tasks"
          },
          {
            title: "Zapier for Process Automation",
            description: "Connect your existing tools and automate workflows without coding. Ideal for automating data entry, notifications, and routine tasks across platforms.",
            cost: "Free tier available, paid plans from £20/month",
            timeToImplement: "1 week",
            expectedRoi: "Reduce manual data entry by 50% and minimise errors"
          },
          {
            title: "Canva AI for Visual Content",
            description: "Create professional marketing materials, presentations, and social media content using AI-powered design tools. No design experience needed.",
            cost: "Free tier available, Canva Pro £10/month",
            timeToImplement: "2 to 3 days",
            expectedRoi: "Save £500 to £1000 per month on design costs"
          }
        ],
        strategic: [
          {
            title: "Customer Relationship Management with AI",
            description: "Implement an AI-enhanced CRM system to better track customer interactions, automate follow-ups, and gain insights from customer data. This will improve customer satisfaction and sales efficiency.",
            investment: "£50 to £200 per month depending on team size",
            timeline: "1 to 2 months",
            impact: "Improve customer retention by 20% and sales conversion by 15%",
            priority: "High"
          },
          {
            title: "AI-Powered Customer Support",
            description: "Deploy an AI chatbot to handle common customer queries 24/7, reducing response times and freeing up your team for complex issues. Integrate with your existing support systems.",
            investment: "£100 to £300 per month for setup and operation",
            timeline: "2 to 3 months",
            impact: "Reduce support response time by 60% and handle 3x more queries",
            priority: "High"
          },
          {
            title: "Data Analytics and Business Intelligence",
            description: "Implement AI-powered analytics tools to gain insights from your business data, identify trends, and make data-driven decisions. Create dashboards for key metrics.",
            investment: "£75 to £250 per month",
            timeline: "2 to 4 months",
            impact: "Improve decision-making speed by 40% and identify new revenue opportunities",
            priority: "Medium"
          }
        ],
        longTerm: [
          {
            title: "Custom AI Assistant Development",
            description: "Build a custom AI assistant tailored to your specific business processes and industry requirements. This could include voice interfaces, automated workflows, and intelligent decision support systems."
          },
          {
            title: "AI-Driven Predictive Analytics",
            description: "Develop predictive models to forecast sales, identify risks, and optimise resource allocation. Use machine learning to continuously improve business outcomes based on historical data and market trends."
          }
        ]
      }
      recommendationsContent = JSON.stringify(parsedRecommendations)
    }

    // Save to database
    const assessment = await prisma.assessment.create({
      data: {
        fullName: data.fullName,
        position: data.position,
        companyName: data.companyName,
        companyUrl: data.companyUrl,
        email: data.email,
        phoneNumber: data.phoneNumber,
        additionalInfo: data.additionalInfo,
        aiAwareness: data.aiAwareness,
        businessProcesses: data.businessProcesses.join(','),
        budgetRange: data.budgetRange,
        teamSize: data.teamSize,
        riskLevel: data.riskLevel,
        painPoints: data.painPoints.join(','),
        industry: data.industry,
        readinessScore: finalScore,
        recommendations: recommendationsContent
      }
    })

    // Save to Google Sheets (non-blocking, don't fail if this errors)
    const appUrl = process.env.NEXTAUTH_URL || 'https://aiaudit.aiconsultancy.org.uk'
    const reportUrl = `${appUrl}/results/${assessment.id}`
    
    // Extract key risk areas from pain points (top 3)
    const keyRiskAreas = data.painPoints.slice(0, 3).join(', ')
    
    // Generate recommendations summary from the parsed recommendations
    let recommendationsSummary = ''
    try {
      const parsedRecs = JSON.parse(recommendationsContent)
      const quickWins = parsedRecs.quickWins || []
      if (quickWins.length > 0) {
        recommendationsSummary = `Top recommendations: ${quickWins.slice(0, 2).map((q: { title: string }) => q.title).join('; ')}. Focus areas: ${data.businessProcesses.slice(0, 2).join(', ')}.`
      } else {
        recommendationsSummary = `Focus on ${data.businessProcesses.slice(0, 2).join(' and ')} for quick AI wins.`
      }
    } catch {
      recommendationsSummary = `Focus on ${data.businessProcesses.slice(0, 2).join(' and ')} for quick AI wins.`
    }
    
    try {
      await appendToGoogleSheets({
        fullName: data.fullName,
        email: data.email,
        assessmentType: `AI Readiness - ${data.industry}`,
        readinessScore: finalScore,
        keyRiskAreas,
        recommendationsSummary,
        reportUrl
      })
    } catch (sheetsError) {
      console.error('Google Sheets error (non-fatal):', sheetsError)
      // Continue execution even if Google Sheets fails
    }

    // Send email notifications (non-blocking)
    const resultsUrl = reportUrl
    
    // Helper function to get readiness level
    const getReadinessLevel = (score: number) => {
      if (score >= 80) return { level: 'Advanced', colour: '#10B981' }
      if (score >= 60) return { level: 'Intermediate', colour: '#0D9488' }
      if (score >= 40) return { level: 'Developing', colour: '#F59E0B' }
      return { level: 'Beginning', colour: '#EF4444' }
    }
    const readiness = getReadinessLevel(finalScore)

    // 1. ADMIN NOTIFICATION - Alert to Support@AiConsultancy.org.uk
    try {
      const adminHtmlBody = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
          <div style="background: linear-gradient(135deg, #0D9488 0%, #1A365D 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Assessment Completed!</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <div style="background: #f0fdfa; border-left: 4px solid #0D9488; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #1A365D; margin: 0 0 5px 0; font-size: 20px;">${data.companyName}</h2>
              <p style="color: #64748b; margin: 0;">AI Readiness Score: <strong style="color: ${readiness.colour}; font-size: 24px;">${finalScore}/100</strong> (${readiness.level})</p>
            </div>

            <h3 style="color: #1A365D; border-bottom: 2px solid #0D9488; padding-bottom: 8px;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Name:</td><td style="padding: 8px 0; color: #1A365D; font-weight: 500;">${data.fullName}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Position:</td><td style="padding: 8px 0; color: #1A365D; font-weight: 500;">${data.position}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #0D9488;">${data.email || 'Not provided'}</a></td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; color: #1A365D;">${data.phoneNumber || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Website:</td><td style="padding: 8px 0;"><a href="${data.companyUrl}" style="color: #0D9488;">${data.companyUrl || 'Not provided'}</a></td></tr>
            </table>

            <h3 style="color: #1A365D; border-bottom: 2px solid #0D9488; padding-bottom: 8px;">Assessment Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
              <tr><td style="padding: 8px 0; color: #64748b; width: 120px;">Industry:</td><td style="padding: 8px 0; color: #1A365D; font-weight: 500;">${data.industry}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Team Size:</td><td style="padding: 8px 0; color: #1A365D;">${data.teamSize}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Budget:</td><td style="padding: 8px 0; color: #1A365D;">${data.budgetRange}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">AI Awareness:</td><td style="padding: 8px 0; color: #1A365D;">${data.aiAwareness}</td></tr>
            </table>

            <h3 style="color: #1A365D; border-bottom: 2px solid #0D9488; padding-bottom: 8px;">Pain Points</h3>
            <p style="color: #475569; line-height: 1.6;">${data.painPoints.join(', ')}</p>

            <h3 style="color: #1A365D; border-bottom: 2px solid #0D9488; padding-bottom: 8px;">Processes to Improve</h3>
            <p style="color: #475569; line-height: 1.6;">${data.businessProcesses.join(', ')}</p>

            ${data.additionalInfo ? `
            <h3 style="color: #1A365D; border-bottom: 2px solid #0D9488; padding-bottom: 8px;">Additional Notes</h3>
            <p style="color: #475569; line-height: 1.6; background: #f8fafc; padding: 15px; border-radius: 8px;">${data.additionalInfo}</p>
            ` : ''}

            <div style="text-align: center; margin-top: 30px;">
              <a href="${resultsUrl}" style="display: inline-block; background: #0D9488; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600;">View Full Report</a>
            </div>
          </div>

          <div style="background: #1A365D; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 12px;">AiConsultancy.org.uk • Submitted ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}</p>
          </div>
        </div>
      `

      await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_ASSESSMENT_COMPLETION_ALERT,
          subject: `🎯 New Assessment: ${data.companyName} (Score: ${finalScore}/100)`,
          body: adminHtmlBody,
          is_html: true,
          recipient_email: 'Support@AiConsultancy.org.uk',
          sender_email: 'noreply@aiconsultancy.org.uk',
          sender_alias: 'AiConsultancy Assessment'
        })
      })
    } catch (adminEmailError) {
      console.error('Admin notification email error (non-fatal):', adminEmailError)
    }

    // 2. USER NOTIFICATION - Thank you email to the person who completed the assessment
    if (data.email) {
      try {
        const userHtmlBody = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc;">
            <div style="background: #ffffff; padding: 40px 30px; text-align: center;">
              <img src="https://aiaudit.aiconsultancy.org.uk/logo-teal-green-circle.png" alt="AiConsultancy" style="width: 100px; height: 100px; margin-bottom: 15px;" />
              <h1 style="color: #008080; font-weight: 700; margin: 0; font-size: 26px;">Your AI Readiness Report is Ready!</h1>
            </div>
            
            <div style="padding: 35px 30px; background: white;">
              <p style="color: #1A365D; font-size: 18px; margin: 0 0 25px 0;">Hello ${data.fullName},</p>
              
              <p style="color: #475569; line-height: 1.7; margin-bottom: 25px;">
                Thank you for completing the AI Readiness Assessment for <strong>${data.companyName}</strong>. 
                We've analysed your responses and prepared a personalised report with actionable recommendations.
              </p>

              <div style="background: #ffffff; border: 2px solid #008080; border-radius: 12px; padding: 25px; text-align: center; margin-bottom: 30px;">
                <p style="color: #008080; font-weight: 700; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your AI Readiness Score</p>
                <div style="font-size: 56px; font-weight: 700; color: #008080; margin-bottom: 5px;">${finalScore}<span style="font-size: 24px; color: #94a3b8;">/100</span></div>
                <p style="color: #008080; font-weight: 700; margin: 0; font-size: 18px;">${readiness.level} Level</p>
              </div>

              <h2 style="color: #1A365D; font-size: 18px; margin-bottom: 15px;">What's in Your Report?</h2>
              <ul style="color: #475569; line-height: 1.8; padding-left: 20px; margin-bottom: 30px;">
                <li><strong>Quick Wins</strong> – Affordable AI tools you can implement this week</li>
                <li><strong>Strategic Recommendations</strong> – Tailored to your industry and budget</li>
                <li><strong>Implementation Pathway</strong> – Step-by-step guide to get started</li>
                <li><strong>Top AI Tools</strong> – Curated selection of free and paid solutions</li>
              </ul>

              <div style="background: #ffffff; border: 2px solid #008080; border-radius: 8px; padding: 20px; text-align: center; margin: 35px 0;">
                <a href="${resultsUrl}" style="color: #008080; font-weight: 700; font-size: 18px; text-decoration: none;">Download Your Report Here</a>
              </div>

              <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                <p style="color: #008080; font-weight: 700; margin: 0; font-size: 14px;">
                  💡 Tip: From your report page, you can download a professional PDF or Word document to share with your team.
                </p>
              </div>

              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />

              <h2 style="color: #1A365D; font-size: 18px; margin-bottom: 15px;">Need Expert Guidance?</h2>
              <p style="color: #475569; line-height: 1.7; margin-bottom: 20px;">
                Book a free 30-minute consultation with our AI specialist, Mark Fenty. 
                We'll walk you through your results and discuss how to get started.
              </p>

              <div style="background: #ffffff; border: 2px solid #008080; border-radius: 8px; padding: 16px 30px; text-align: center;">
                <a href="https://tidycal.com/markfenty/30-minute-meeting" style="color: #008080; font-weight: 700; font-size: 16px; text-decoration: none;">Book Free Consultation</a>
              </div>
            </div>

            <div style="background: #ffffff; border-top: 2px solid #008080; padding: 25px; text-align: center;">
              <p style="color: #008080; font-weight: 700; font-style: italic; margin: 0 0 15px 0; font-size: 14px;">
                "We don't just talk about AI. We prove it, and we do!"
              </p>
              <p style="color: #64748b; margin: 0; font-size: 12px;">
                AiConsultancy.org.uk • <a href="mailto:Support@AiConsultancy.org.uk" style="color: #008080;">Support@AiConsultancy.org.uk</a>
              </p>
            </div>
          </div>
        `

        await fetch('https://apps.abacus.ai/api/sendNotificationEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            deployment_token: process.env.ABACUSAI_API_KEY,
            app_id: process.env.WEB_APP_ID,
            notification_id: process.env.NOTIF_ID_ASSESSMENT_RESULTS_EMAIL,
            subject: `Your AI Readiness Report for ${data.companyName} – Score: ${finalScore}/100`,
            body: userHtmlBody,
            is_html: true,
            recipient_email: data.email,
            sender_email: 'noreply@aiconsultancy.org.uk',
            sender_alias: 'AiConsultancy'
          })
        })
      } catch (userEmailError) {
        console.error('User notification email error (non-fatal):', userEmailError)
      }
    }

    return NextResponse.json({
      success: true,
      id: assessment.id,
      score: finalScore
    })

  } catch (error) {
    console.error('Error processing assessment:', error)
    return NextResponse.json(
      { error: 'Failed to process assessment' },
      { status: 500 }
    )
  }
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Download, 
  Mail, 
  TrendingUp, 
  Target, 
  Zap,
  CheckCircle,
  Clock,
  PoundSterling,
  Users,
  Building2,
  Calendar,
  Check,
  FileText,
  FileType,
  Loader2
} from 'lucide-react'

interface Assessment {
  id: string
  createdAt: Date | string
  fullName: string
  companyName: string
  readinessScore: number
  recommendations: string
  industry: string
  budgetRange: string
  teamSize: string
}

interface ResultsDisplayProps {
  assessment: Assessment
}

export default function ResultsDisplay({ assessment }: ResultsDisplayProps) {
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false)
  
  const recommendations = JSON.parse(assessment.recommendations || '{}')
  const score = assessment.readinessScore

  const getScoreCategory = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' }
    if (score >= 60) return { label: 'Good', color: 'text-teal-600', bgColor: 'bg-teal-100' }
    if (score >= 40) return { label: 'Moderate', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
    return { label: 'Developing', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  }

  const scoreCategory = getScoreCategory(score)

  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true)
    try {
      const response = await fetch(`/api/assessment/pdf/${assessment.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `AI-Assessment-Report-${assessment.companyName}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        
        // Send email notification
        try {
          await fetch(`/api/assessment/email/${assessment.id}`, { method: 'POST' })
        } catch (emailError) {
          console.error('Error sending automatic email:', emailError)
        }
      } else {
        throw new Error('Failed to generate PDF')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again or use the Word format.')
    } finally {
      setIsDownloadingPdf(false)
    }
  }

  const handleDownloadDocx = async () => {
    setIsDownloadingDocx(true)
    try {
      const response = await fetch(`/api/assessment/docx/${assessment.id}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        
        const a = document.createElement('a')
        a.href = url
        a.download = `AI-Assessment-Report-${assessment.companyName}.docx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        
        // Send email notification
        try {
          await fetch(`/api/assessment/email/${assessment.id}`, { method: 'POST' })
        } catch (emailError) {
          console.error('Error sending automatic email:', emailError)
        }
      } else {
        throw new Error('Failed to generate DOCX')
      }
    } catch (error) {
      console.error('Error downloading DOCX:', error)
      alert('Failed to download report. Please try again.')
    } finally {
      setIsDownloadingDocx(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Large Green Tick */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-6"
          >
            <div className="w-24 h-24 mx-auto bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check className="h-14 w-14 text-white" strokeWidth={3} />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-xl font-semibold text-green-600 mb-2">Assessment Complete!</h2>
            <h1 className="text-3xl lg:text-4xl font-bold text-teal-600 mb-4">
              Your AI Assessment Results
            </h1>
            <p className="text-lg text-gray-600">
              Personalised recommendations for {assessment.fullName} at {assessment.companyName}
            </p>
          </motion.div>
        </div>

        {/* AI Readiness Score - Full Width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <Card className="border-2 border-teal-200 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-teal-600">
                AI Readiness Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-6">
                <div className="relative">
                  <div className="w-32 h-32 mx-auto relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="50"
                        stroke="#0D9488"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${score * 3.14} 314`}
                        className="transition-all duration-2000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600">{score}</div>
                        <div className="text-sm text-gray-500">out of 100</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <Badge className={`${scoreCategory.bgColor} ${scoreCategory.color} text-lg px-4 py-2 mb-4`}>
                    {scoreCategory.label} AI Readiness
                  </Badge>
                  
                  <Progress value={score} className="h-3 mb-4 w-64" />
                  
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <Building2 className="h-4 w-4 text-teal-600" />
                      <span>{assessment.industry}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <Users className="h-4 w-4 text-teal-600" />
                      <span>{assessment.teamSize}</span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start space-x-2">
                      <PoundSterling className="h-4 w-4 text-teal-600" />
                      <span className="font-bold text-teal-700">{assessment.budgetRange}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Download Buttons - PDF and DOCX */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <Card className="border-2 border-teal-200 shadow-xl bg-gradient-to-br from-teal-50 to-white">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center space-y-6">
                <h3 className="text-xl font-semibold text-teal-700">Download Your Report</h3>
                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                  {/* PDF Download Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf || isDownloadingDocx}
                      size="lg"
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isDownloadingPdf ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          Download as PDF
                        </>
                      )}
                    </Button>
                  </motion.div>
                  
                  {/* DOCX Download Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={handleDownloadDocx}
                      disabled={isDownloadingPdf || isDownloadingDocx}
                      size="lg"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isDownloadingDocx ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating Word...
                        </>
                      ) : (
                        <>
                          <FileType className="mr-2 h-5 w-5" />
                          Download as Word
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
                <p className="text-sm text-gray-600">
                  Choose your preferred format. Both contain your comprehensive AI assessment with personalised recommendations.
                </p>
                {(isDownloadingPdf) && (
                  <p className="text-xs text-amber-600">
                    PDF generation may take up to 60 seconds. Please wait...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations - Full Width */}
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-6 max-w-5xl mx-auto"
          >
              {/* Quick Wins */}
              {recommendations.quickWins && (
                <Card className="border border-teal-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-teal-700">
                      <Zap className="h-5 w-5" />
                      <span>Quick wins (start this month)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.quickWins.map((win: any, index: number) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-teal-50 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-teal-900">{win.title}</h4>
                            <p className="text-sm text-teal-700">{win.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-teal-600">
                              <span>Cost: {win.cost}</span>
                              <span>Time: {win.timeToImplement}</span>
                              <span>ROI: {win.expectedRoi}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Strategic Recommendations */}
              {recommendations.strategic && (
                <Card className="border border-teal-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-teal-700">
                      <Target className="h-5 w-5" />
                      <span>Strategic recommendations (3 to 6 months)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recommendations.strategic.map((rec: any, index: number) => (
                        <div key={index} className="border border-teal-200 rounded-lg p-4 bg-teal-50">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-teal-900">{rec.title}</h4>
                            <Badge variant="outline" className="text-teal-700 border-teal-300">
                              Priority: {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-teal-800 mb-3">{rec.description}</p>
                          <div className="grid md:grid-cols-3 gap-2 text-xs text-teal-600">
                            <div>Investment: {rec.investment}</div>
                            <div>Timeline: {rec.timeline}</div>
                            <div>Impact: {rec.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Long-term Vision */}
              {recommendations.longTerm && (
                <Card className="border border-teal-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-teal-700">
                      <TrendingUp className="h-5 w-5" />
                      <span>Long-term vision (6+ months)</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recommendations.longTerm.map((vision: any, index: number) => (
                        <div key={index} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                          <h4 className="font-medium text-teal-900 mb-2">{vision.title}</h4>
                          <p className="text-teal-800 text-sm">{vision.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Next Steps */}
              <Card className="border border-teal-200 shadow-lg bg-teal-50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-teal-700">
                    <Clock className="h-5 w-5" />
                    <span>Your next steps</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                      <span className="text-gray-800">Download your comprehensive report</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                      <span className="text-gray-800">Book a free consultation with our team</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                      <span className="text-gray-800">Start with the quick win recommendations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
        </div>

        {/* Ready to Transform Section - Teal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12"
        >
          <Card className="border-2 border-teal-300 shadow-xl bg-teal-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
                <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
                  Our AI consultant Mark Fenty is ready to help you implement these recommendations and accelerate your AI journey.
                </p>
                
                {/* Consultation Booking Section */}
                <div className="max-w-md mx-auto mb-6">
                  <div className="bg-white/10 rounded-lg p-4">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-teal-200" />
                    <h4 className="font-semibold mb-1">
                      <a href="https://tidycal.com/markfenty/30-minute-meeting" target="_blank" rel="noopener" className="hover:underline">
                        Book a 30 minute FREE AI consultation
                      </a>
                    </h4>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <a 
                      href="mailto:Support@AiConsultancy.org.uk" 
                      className="hover:underline transition-all duration-200"
                    >
                      Support@AiConsultancy.org.uk
                    </a>
                  </div>
                  <div>
                    <span className="font-medium">Mark Fenty — Consultant &amp; Founder</span>
                  </div>
                </div>
                
                <Button
                  className="mt-6 bg-white text-teal-600 hover:bg-teal-50 font-semibold px-8 py-3"
                  onClick={() => window.location.href = 'mailto:Support@AiConsultancy.org.uk?subject=AI%20Consultation%20Request'}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

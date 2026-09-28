'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, ArrowRight, Zap, Clock, CheckCircle } from 'lucide-react'
import ContactInfoStep from './contact-info-step'
import AIAwarenessStep from './ai-awareness-step'
import BusinessProcessStep from './business-process-step'
import BudgetStep from './budget-step'
import TeamCapabilityStep from './team-capability-step'
import PainPointsStep from './pain-points-step'
import RiskAssessmentStep from './risk-assessment-step'
import IndustryStep from './industry-step'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export interface AssessmentData {
  // Contact Information
  fullName: string
  position: string
  companyName: string
  companyUrl: string
  email?: string
  phoneNumber?: string
  additionalInfo?: string
  
  // Assessment Questions
  aiAwareness: string
  businessProcesses: string[]
  budgetRange: string
  teamSize: string
  painPoints: string[]
  riskLevel: string
  industry: string
}

const initialData: AssessmentData = {
  fullName: '',
  position: '',
  companyName: '',
  companyUrl: '',
  email: '',
  phoneNumber: '',
  additionalInfo: '',
  aiAwareness: '',
  businessProcesses: [],
  budgetRange: '',
  teamSize: '',
  painPoints: [],
  riskLevel: '',
  industry: '',
}

const steps = [
  { id: 'contact', title: 'Contact Information', component: ContactInfoStep },
  { id: 'awareness', title: 'AI Knowledge', component: AIAwarenessStep },
  { id: 'processes', title: 'Business Processes', component: BusinessProcessStep },
  { id: 'budget', title: 'Budget', component: BudgetStep },
  { id: 'team', title: 'Team Size', component: TeamCapabilityStep },
  { id: 'risk', title: 'Risk Assessment', component: RiskAssessmentStep },
  { id: 'painpoints', title: 'Challenges', component: PainPointsStep },
  { id: 'industry', title: 'Industry Sector', component: IndustryStep },
]

export default function AssessmentFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<AssessmentData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCountdown, setShowCountdown] = useState(false)
  const [countdown, setCountdown] = useState(10)
  const [resultId, setResultId] = useState<string | null>(null)
  const [apiComplete, setApiComplete] = useState(false)
  const router = useRouter()
  
  const progress = ((currentStep + 1) / steps.length) * 100
  const CurrentStepComponent = steps[currentStep]?.component

  const updateData = (newData: Partial<AssessmentData>) => {
    setData(prev => ({ ...prev, ...newData }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Contact Info
        return data.fullName && data.position && data.companyName && data.companyUrl
      case 1: // AI Awareness
        return data.aiAwareness
      case 2: // Business Processes
        return data.businessProcesses.length > 0
      case 3: // Budget
        return data.budgetRange
      case 4: // Team
        return data.teamSize
      case 5: // Risk Assessment
        return data.riskLevel
      case 6: // Pain Points
        return data.painPoints.length > 0
      case 7: // Industry
        return data.industry
      default:
        return true
    }
  }

  // Countdown timer effect - ticks every second
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [showCountdown, countdown])

  // Navigate when countdown reaches 0 AND API is complete
  useEffect(() => {
    if (showCountdown && countdown === 0 && apiComplete && resultId) {
      router.push(`/results/${resultId}`)
    }
  }, [showCountdown, countdown, apiComplete, resultId, router])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setShowCountdown(true)
    setCountdown(10)
    setApiComplete(false)
    setResultId(null)
    
    try {
      // API call runs asynchronously during countdown
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setResultId(result.id)
        setApiComplete(true)
        // Navigation happens via useEffect when countdown reaches 0
      } else {
        throw new Error('Failed to submit assessment')
      }
    } catch (error) {
      console.error('Error submitting assessment:', error)
      setShowCountdown(false)
      setIsSubmitting(false)
      setApiComplete(false)
      alert('There was an error submitting your assessment. Please try again.')
    }
  }

  // Countdown Overlay
  if (showCountdown) {
    const isComplete = countdown === 0 && apiComplete
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            {/* Circular countdown */}
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={isComplete ? "#10B981" : "#0D9488"}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 1 }}
                  animate={{ pathLength: countdown / 10 }}
                  transition={{ duration: 1, ease: "linear" }}
                  style={{
                    strokeDasharray: "439.82",
                    strokeDashoffset: 0,
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {isComplete ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <span className="text-5xl font-bold text-teal-600">{countdown}</span>
                )}
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-4">
              {isComplete ? "Your Report is Ready!" : "Processing Your Assessment..."}
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {isComplete 
                ? "Redirecting you to your personalised AI roadmap..."
                : "Our AI is analysing your responses and generating personalised recommendations for your business."
              }
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2">
              <Zap className="h-5 w-5 text-teal-500 animate-pulse" />
              <span className="text-sm text-teal-600">
                {isComplete ? "Loading your results" : "Generating your custom AI roadmap"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-4 md:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
            <Zap className="h-10 w-10 text-teal-600" />
            <span className="text-2xl font-bold text-teal-600">AiConsultancy</span>
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
            <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
            AI readiness assessment
          </h1>
          <p className="text-base md:text-lg text-teal-600 font-medium">
            Step {currentStep + 1} of {steps.length}: {steps[currentStep]?.title}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-700">Progress</span>
            </div>
            <span className="text-sm font-semibold text-teal-600">{Math.round(progress)}% complete</span>
          </div>
          <div className="relative h-3 bg-white rounded-full border border-gray-200 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Getting started</span>
            <span>Almost there</span>
            <span>Complete</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl border border-gray-100 p-4 md:p-8 mb-6 md:mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {CurrentStepComponent && (
                <CurrentStepComponent data={data} updateData={updateData} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            className={`flex items-center space-x-2 w-full sm:w-auto border-2 ${
              currentStep === 0 
                ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                : 'border-teal-500 text-teal-600 hover:bg-teal-50 hover:border-teal-600'
            }`}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${
                  index <= currentStep ? 'bg-teal-600' : 'bg-gray-300'
                } transition-colors`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
            disabled={!canProceed() || isSubmitting}
          >
            <span>{currentStep === steps.length - 1 ? (isSubmitting ? 'Processing...' : 'Generate My Report') : 'Next'}</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Time Indicator */}
        <div className="text-center mt-6 md:mt-8">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <p className="text-sm text-gray-500">
              Estimated time remaining: {Math.max(0, Math.ceil((steps.length - currentStep - 1) * 0.4))} {Math.ceil((steps.length - currentStep - 1) * 0.4) === 1 ? 'minute' : 'minutes'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

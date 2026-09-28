'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AssessmentData } from './assessment-flow'
import { AlertTriangle, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface RiskAssessmentStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const riskOptions = [
  {
    value: 'high-risk',
    title: 'High Risk',
    description: 'Our business faces significant challenges without AI adoption. We risk falling behind competitors and losing market share.',
    icon: AlertTriangle,
    bgColor: 'bg-red-100',
    borderColor: 'border-teal-500',
    selectedBorder: 'border-teal-600',
    iconColor: 'text-red-600'
  },
  {
    value: 'medium-risk',
    title: 'Medium Risk',
    description: 'We see opportunities for improvement but can manage without immediate AI adoption. Some inefficiencies exist.',
    icon: AlertCircle,
    bgColor: 'bg-amber-100',
    borderColor: 'border-teal-500',
    selectedBorder: 'border-teal-600',
    iconColor: 'text-amber-600'
  },
  {
    value: 'low-risk',
    title: 'Low Risk',
    description: 'Our current processes are working well. AI would be nice to have but is not urgent for our operations.',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    borderColor: 'border-teal-500',
    selectedBorder: 'border-teal-600',
    iconColor: 'text-green-600'
  }
]

export default function RiskAssessmentStep({ data, updateData }: RiskAssessmentStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
          <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
          How would you assess your AI adoption risk?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Consider the impact of not adopting AI solutions on your business over the next 12 months.
        </p>
      </div>

      <RadioGroup
        value={data.riskLevel || ''}
        onValueChange={(value) => updateData({ riskLevel: value })}
        className="space-y-4"
      >
        {riskOptions.map((option) => {
          const isSelected = data.riskLevel === option.value
          return (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={`risk-${option.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`risk-${option.value}`}
                className={`flex items-start space-x-3 md:space-x-4 rounded-xl border-2 p-4 md:p-6 cursor-pointer transition-all ${option.bgColor} ${
                  isSelected 
                    ? `${option.selectedBorder} ring-2 ring-teal-300` 
                    : `${option.borderColor} hover:border-teal-600`
                }`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-white/80 ${option.iconColor}`}>
                  <option.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700">
                    {option.description}
                  </p>
                </div>
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-teal-600 bg-teal-600' : 'border-teal-400 bg-white'
                }`}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
              </Label>
            </div>
          )
        })}
      </RadioGroup>

      <div className="text-center mt-8">
        <p className="text-sm text-teal-700 bg-teal-50 inline-block px-6 py-3 rounded-lg border border-teal-200">
          Your risk assessment helps us prioritise recommendations. Higher risk situations benefit from faster implementation timelines.
        </p>
      </div>
    </div>
  )
}

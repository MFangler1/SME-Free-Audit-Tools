'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AssessmentData } from './assessment-flow'
import { Brain, Lightbulb, Zap, Target, Clock } from 'lucide-react'

interface AIAwarenessStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const awarenessOptions = [
  {
    value: 'no-knowledge',
    title: 'Complete beginner',
    description: "I've heard about AI but don't really understand what it can do for my business.",
    icon: Brain,
  },
  {
    value: 'basic-knowledge',
    title: 'Basic understanding',
    description: "I know AI exists and have some ideas about its potential, but haven't explored it seriously.",
    icon: Lightbulb,
  },
  {
    value: 'moderate-knowledge',
    title: 'Moderately informed',
    description: "I've researched AI solutions and understand some use cases, but haven't implemented anything yet.",
    icon: Target,
  },
  {
    value: 'experienced',
    title: 'Experienced user',
    description: "I've already implemented some AI tools and am looking to expand or optimise our AI usage.",
    icon: Zap,
  }
]

export default function AIAwarenessStep({ data, updateData }: AIAwarenessStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
          <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
          What's your current AI knowledge level?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This helps us tailor our recommendations to your experience level.
        </p>
      </div>

      <RadioGroup
        value={data.aiAwareness}
        onValueChange={(value) => updateData({ aiAwareness: value })}
        className="space-y-4"
      >
        {awarenessOptions.map((option) => {
          const isSelected = data.aiAwareness === option.value
          return (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={`awareness-${option.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`awareness-${option.value}`}
                className={`flex items-start space-x-3 md:space-x-4 rounded-xl border-2 p-4 md:p-6 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-teal-600 bg-teal-100' 
                    : 'border-teal-300 bg-teal-50 hover:border-teal-500'
                }`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-teal-200 text-teal-700'
                }`}>
                  <option.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1 md:mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {option.description}
                  </p>
                </div>
                <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'border-teal-600 bg-teal-600' : 'border-teal-400'
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
          Whether you're just starting out or already experienced with AI, we'll provide recommendations that match your current level and help you take the next step.
        </p>
      </div>
    </div>
  )
}

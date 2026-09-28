'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AssessmentData } from './assessment-flow'
import { PiggyBank, Banknote, Building, TrendingUp, Clock } from 'lucide-react'

interface BudgetStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const budgetOptions = [
  {
    value: 'under-500',
    title: 'Under £500 per month',
    description: 'Looking for free or very low-cost solutions to get started',
    icon: PiggyBank,
    recommendation: 'Perfect for testing AI tools and automation basics',
    gradient: 'from-teal-50 to-teal-100'
  },
  {
    value: '500-2000',
    title: '£500 to £2,000 per month',
    description: 'Ready to invest in proven AI solutions for key processes',
    icon: Banknote,
    recommendation: 'Great budget for comprehensive AI implementation',
    gradient: 'from-teal-100 to-teal-200'
  },
  {
    value: '2000-5000',
    title: '£2,000 to £5,000 per month',
    description: 'Looking for advanced AI solutions and custom implementations',
    icon: Building,
    recommendation: 'Ideal for enterprise-level AI transformation',
    gradient: 'from-teal-200 to-teal-300'
  },
  {
    value: 'over-5000',
    title: 'Over £5,000 per month',
    description: 'Ready for comprehensive AI transformation with dedicated support',
    icon: TrendingUp,
    recommendation: 'Full-scale AI integration with premium solutions',
    gradient: 'from-teal-300 to-teal-400'
  }
]

export default function BudgetStep({ data, updateData }: BudgetStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
          <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
          What's your budget for AI implementation?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Understanding your budget helps us recommend solutions that fit your financial constraints whilst maximising value.
        </p>
      </div>

      <RadioGroup
        value={data.budgetRange}
        onValueChange={(value) => updateData({ budgetRange: value })}
        className="space-y-4"
      >
        {budgetOptions.map((option) => {
          const isSelected = data.budgetRange === option.value
          return (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={`budget-${option.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`budget-${option.value}`}
                className={`flex items-start space-x-3 md:space-x-4 rounded-xl border-2 p-4 md:p-6 cursor-pointer transition-all bg-gradient-to-r ${option.gradient} ${
                  isSelected 
                    ? 'border-teal-600 ring-2 ring-teal-300' 
                    : 'border-teal-300 hover:border-teal-500'
                }`}
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-white/80 text-teal-700'
                }`}>
                  <option.icon className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-700 mb-2">
                    {option.description}
                  </p>
                  <p className="text-xs md:text-sm text-teal-700 font-medium">
                    {option.recommendation}
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
          Many AI tools offer free tiers or trials. We'll help you identify which ones to test before committing to paid plans, and we prioritise solutions that typically pay for themselves within three to six months.
        </p>
      </div>
    </div>
  )
}

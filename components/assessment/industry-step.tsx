'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AssessmentData } from './assessment-flow'
import { 
  Building2, 
  ShoppingCart, 
  Stethoscope, 
  GraduationCap, 
  Briefcase,
  Truck,
  Home,
  Heart,
  Wrench,
  Palette,
  Users,
  MoreHorizontal,
  Clock
} from 'lucide-react'

interface IndustryStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const industryOptions = [
  {
    value: 'technology',
    title: 'Technology & Software',
    description: 'Software development, IT services, tech startups',
    icon: Building2,
    aiReadiness: 'High'
  },
  {
    value: 'ecommerce',
    title: 'E-commerce & Retail',
    description: 'Online stores, retail businesses, marketplace sellers',
    icon: ShoppingCart,
    aiReadiness: 'High'
  },
  {
    value: 'healthcare',
    title: 'Healthcare & Medical',
    description: 'Medical practices, healthcare services, wellness',
    icon: Stethoscope,
    aiReadiness: 'Medium'
  },
  {
    value: 'education',
    title: 'Education & Training',
    description: 'Schools, training organisations, online learning',
    icon: GraduationCap,
    aiReadiness: 'Medium'
  },
  {
    value: 'professional-services',
    title: 'Professional Services',
    description: 'Consulting, legal, accounting, marketing agencies',
    icon: Briefcase,
    aiReadiness: 'High'
  },
  {
    value: 'manufacturing',
    title: 'Manufacturing & Logistics',
    description: 'Production, supply chain, distribution',
    icon: Truck,
    aiReadiness: 'Medium'
  },
  {
    value: 'real-estate',
    title: 'Real Estate & Property',
    description: 'Property management, real estate services',
    icon: Home,
    aiReadiness: 'Medium'
  },
  {
    value: 'nonprofit',
    title: 'Nonprofit & NGO',
    description: 'Charities, foundations, social organisations',
    icon: Heart,
    aiReadiness: 'Low'
  },
  {
    value: 'trades',
    title: 'Trades & Field Services',
    description: 'Construction, plumbing, electrical, maintenance',
    icon: Wrench,
    aiReadiness: 'Low'
  },
  {
    value: 'creative',
    title: 'Creative & Media',
    description: 'Design, marketing, content creation, media',
    icon: Palette,
    aiReadiness: 'High'
  },
  {
    value: 'hospitality',
    title: 'Hospitality & Food Service',
    description: 'Restaurants, hotels, event planning',
    icon: Users,
    aiReadiness: 'Medium'
  },
  {
    value: 'other',
    title: 'Other Industry',
    description: 'Industry not listed above',
    icon: MoreHorizontal,
    aiReadiness: 'Medium'
  }
]

export default function IndustryStep({ data, updateData }: IndustryStepProps) {
  const getReadinessColor = (readiness: string) => {
    switch (readiness) {
      case 'High': return 'text-teal-700 bg-teal-200'
      case 'Medium': return 'text-teal-600 bg-teal-100'
      case 'Low': return 'text-teal-500 bg-teal-50'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
          <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
          What industry are you in?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Different industries have unique AI opportunities and challenges. This helps us provide industry-specific recommendations.
        </p>
      </div>

      <RadioGroup
        value={data.industry}
        onValueChange={(value) => updateData({ industry: value })}
        className="grid sm:grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
      >
        {industryOptions.map((option) => {
          const isSelected = data.industry === option.value
          return (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={`industry-${option.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`industry-${option.value}`}
                className={`flex items-start space-x-3 rounded-xl border-2 p-3 md:p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-teal-600 bg-teal-100' 
                    : 'border-teal-200 bg-teal-50 hover:border-teal-400'
                }`}
              >
                <div className={`w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-teal-600 text-white' : 'bg-teal-200 text-teal-700'
                }`}>
                  <option.icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900">
                      {option.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getReadinessColor(option.aiReadiness)}`}>
                      {option.aiReadiness}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">
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

      <div className="bg-teal-50 rounded-lg p-4 md:p-6 border border-teal-200">
        <h3 className="font-semibold text-teal-700 mb-3 text-center">AI potential explained</h3>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 text-sm text-center">
          <div>
            <span className="inline-block w-3 h-3 bg-teal-600 rounded-full mr-2"></span>
            <strong className="text-teal-700">High AI potential</strong>
            <p className="text-gray-600 mt-1">Many proven AI solutions available with strong ROI potential.</p>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-teal-500 rounded-full mr-2"></span>
            <strong className="text-teal-600">Medium AI potential</strong>
            <p className="text-gray-600 mt-1">Good opportunities exist, may require more customisation.</p>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-teal-400 rounded-full mr-2"></span>
            <strong className="text-teal-500">Emerging AI potential</strong>
            <p className="text-gray-600 mt-1">Growing opportunities with focus on fundamental automation.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

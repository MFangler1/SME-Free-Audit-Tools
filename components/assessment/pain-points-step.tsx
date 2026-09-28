'use client'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AssessmentData } from './assessment-flow'
import { 
  Clock, 
  PoundSterling, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Zap,
  Target,
  BarChart3,
  Shield,
  Repeat,
  Brain,
  Scale
} from 'lucide-react'

interface PainPointsStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const painPointOptions = [
  {
    value: 'time-consuming-tasks',
    title: 'Too much time on repetitive tasks',
    description: 'Staff spending hours on manual, repetitive work that could be automated',
    icon: Clock,
    impact: 'High',
    solution: 'Process automation and workflow tools'
  },
  {
    value: 'rising-costs',
    title: 'Rising operational costs',
    description: 'Labour and operational expenses growing faster than revenue',
    icon: PoundSterling,
    impact: 'High',
    solution: 'Cost optimisation through intelligent automation'
  },
  {
    value: 'competitor-pressure',
    title: 'Competitors moving faster',
    description: 'Other businesses in your industry are outpacing you with technology',
    icon: TrendingDown,
    impact: 'Medium',
    solution: 'Competitive AI strategies and quick wins'
  },
  {
    value: 'staff-burnout',
    title: 'Employee burnout and turnover',
    description: 'High staff turnover due to boring, repetitive work',
    icon: Users,
    impact: 'High',
    solution: 'Task automation to improve job satisfaction'
  },
  {
    value: 'scaling-difficulties',
    title: 'Difficulty scaling operations',
    description: 'Unable to handle more customers without proportionally increasing staff',
    icon: Scale,
    impact: 'Medium',
    solution: 'Scalable automation and process optimisation'
  },
  {
    value: 'data-overwhelm',
    title: 'Drowning in data',
    description: 'Too much information to analyse effectively for decision-making',
    icon: BarChart3,
    impact: 'Medium',
    solution: 'AI-powered analytics and reporting tools'
  },
  {
    value: 'customer-service-delays',
    title: 'Slow customer response times',
    description: 'Cannot respond to customer enquiries quickly enough',
    icon: Zap,
    impact: 'High',
    solution: 'Automated customer service and chatbot solutions'
  },
  {
    value: 'human-errors',
    title: 'Frequent human errors',
    description: 'Mistakes in data entry, calculations, or process execution',
    icon: AlertTriangle,
    impact: 'Medium',
    solution: 'Automated validation and error-checking systems'
  },
  {
    value: 'missed-opportunities',
    title: 'Missing growth opportunities',
    description: 'Unable to identify and capitalise on business opportunities quickly',
    icon: Target,
    impact: 'Medium',
    solution: 'AI-powered insights and opportunity identification'
  },
  {
    value: 'security-concerns',
    title: 'Security and compliance risks',
    description: 'Difficulty maintaining security standards and regulatory compliance',
    icon: Shield,
    impact: 'High',
    solution: 'Automated security monitoring and compliance tools'
  },
  {
    value: 'inconsistent-quality',
    title: 'Inconsistent work quality',
    description: 'Variable quality in outputs depending on who performs the task',
    icon: Repeat,
    impact: 'Medium',
    solution: 'Standardised automated processes and quality control'
  },
  {
    value: 'decision-making',
    title: 'Slow decision making',
    description: 'Taking too long to make informed business decisions',
    icon: Brain,
    impact: 'Medium',
    solution: 'Real-time analytics and decision support systems'
  }
]

export default function PainPointsStep({ data, updateData }: PainPointsStepProps) {
  const handlePainPointToggle = (painPointValue: string, checked: boolean) => {
    const currentPainPoints = data.painPoints || []
    if (checked) {
      updateData({ painPoints: [...currentPainPoints, painPointValue] })
    } else {
      updateData({ painPoints: currentPainPoints.filter(p => p !== painPointValue) })
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-teal-700 bg-teal-100'
      case 'Medium': return 'text-teal-600 bg-teal-50'
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
          What are your biggest business challenges?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select all the pain points that resonate with your current situation. We'll prioritise AI solutions that address these specific challenges.
        </p>
      </div>

      <div className="grid gap-4">
        {painPointOptions.map((option) => {
          const isChecked = data.painPoints?.includes(option.value) || false
          return (
            <div 
              key={option.value} 
              className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                isChecked 
                  ? 'border-teal-600 bg-teal-100' 
                  : 'border-teal-200 bg-teal-50 hover:border-teal-400'
              }`}
              onClick={() => handlePainPointToggle(option.value, !isChecked)}
            >
              <Checkbox
                id={option.value}
                checked={isChecked}
                onCheckedChange={(checked) => handlePainPointToggle(option.value, checked === true)}
                className="mt-1 border-teal-500 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <option.icon className="h-4 w-4 text-teal-600" />
                    <Label
                      htmlFor={option.value}
                      className="font-medium text-gray-900 cursor-pointer"
                    >
                      {option.title}
                    </Label>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(option.impact)}`}>
                    {option.impact} impact
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {option.description}
                </p>
                <p className="text-xs text-teal-600 font-medium">
                  Solution: {option.solution}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-teal-700 bg-teal-50 inline-block px-6 py-3 rounded-lg border border-teal-200">
          The more challenges you select, the more comprehensive your AI implementation roadmap will be. We'll rank solutions by their potential to address multiple pain points simultaneously.
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Selected: <strong className="text-teal-600">{data.painPoints?.length || 0}</strong> challenges
        </p>
      </div>
    </div>
  )
}

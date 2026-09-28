'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { AssessmentData } from './assessment-flow'
import { User, Users, Building, Zap, Clock } from 'lucide-react'

interface TeamCapabilityStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const teamOptions = [
  {
    value: 'solo',
    title: 'Just me (solopreneur)',
    description: 'I work alone and need solutions I can set up and manage myself',
    icon: User,
    focus: 'Self-service tools with minimal setup required',
    gradient: 'from-teal-50 to-teal-100'
  },
  {
    value: 'small-team',
    title: 'Small team (2 to 10 people)',
    description: 'Small team with basic technical skills, prefer user-friendly solutions',
    icon: Users,
    focus: 'Easy-to-use tools with basic training requirements',
    gradient: 'from-teal-100 to-teal-200'
  },
  {
    value: 'medium-team',
    title: 'Medium team (11 to 50 people)',
    description: 'Established team with some technical expertise and dedicated IT support',
    icon: Building,
    focus: 'More advanced solutions with integration capabilities',
    gradient: 'from-teal-200 to-teal-300'
  },
  {
    value: 'large-team',
    title: 'Large team (50+ people)',
    description: 'Large organisation with dedicated IT department and technical resources',
    icon: Zap,
    focus: 'Enterprise solutions with custom integration options',
    gradient: 'from-teal-300 to-teal-400'
  }
]

export default function TeamCapabilityStep({ data, updateData }: TeamCapabilityStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
          <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
          What's your team size and technical capability?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This helps us recommend AI solutions that match your team's ability to implement and manage them effectively.
        </p>
      </div>

      <RadioGroup
        value={data.teamSize}
        onValueChange={(value) => updateData({ teamSize: value })}
        className="space-y-4"
      >
        {teamOptions.map((option) => {
          const isSelected = data.teamSize === option.value
          return (
            <div key={option.value} className="relative">
              <RadioGroupItem
                value={option.value}
                id={`team-${option.value}`}
                className="sr-only"
              />
              <Label
                htmlFor={`team-${option.value}`}
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
                    {option.focus}
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

      <div className="bg-teal-50 rounded-lg p-4 md:p-6 border border-teal-200">
        <h3 className="font-semibold text-teal-700 mb-3 text-center">What this means for your recommendations</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="text-center">
            <h4 className="font-medium text-teal-600 mb-2">Smaller teams</h4>
            <ul className="space-y-1 text-gray-600">
              <li>Plug-and-play solutions</li>
              <li>Minimal setup requirements</li>
              <li>Built-in tutorials and support</li>
              <li>SaaS-based tools</li>
            </ul>
          </div>
          <div className="text-center">
            <h4 className="font-medium text-teal-600 mb-2">Larger teams</h4>
            <ul className="space-y-1 text-gray-600">
              <li>Advanced integration options</li>
              <li>Custom implementation plans</li>
              <li>Enterprise security features</li>
              <li>Scalable architecture recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

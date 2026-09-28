'use client'

import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { AssessmentData } from './assessment-flow'
import { Clock } from 'lucide-react'
import { 
  Mail, 
  FileText, 
  Users, 
  BarChart3, 
  ShoppingCart, 
  Headphones, 
  Calendar, 
  CreditCard,
  Truck,
  MessageSquare,
  Database,
  Shield
} from 'lucide-react'

interface BusinessProcessStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

const processOptions = [
  {
    value: 'email-marketing',
    title: 'Email Marketing & Campaigns',
    description: 'Automate email sequences, personalise content, and optimise send times',
    icon: Mail,
    category: 'Marketing'
  },
  {
    value: 'content-creation',
    title: 'Content Creation & Writing',
    description: 'Generate blog posts, social media content, and marketing materials',
    icon: FileText,
    category: 'Marketing'
  },
  {
    value: 'customer-service',
    title: 'Customer Service & Support',
    description: 'Chatbots, automated responses, and support ticket management',
    icon: Headphones,
    category: 'Customer Service'
  },
  {
    value: 'social-media',
    title: 'Social Media Management',
    description: 'Automated posting, content scheduling, and engagement monitoring',
    icon: MessageSquare,
    category: 'Marketing'
  },
  {
    value: 'data-analysis',
    title: 'Data Analysis & Reporting',
    description: 'Analyse trends, generate insights, and create automated reports',
    icon: BarChart3,
    category: 'Analytics'
  },
  {
    value: 'inventory-management',
    title: 'Inventory & Supply Chain',
    description: 'Stock monitoring, demand forecasting, and supplier management',
    icon: Truck,
    category: 'Operations'
  },
  {
    value: 'accounting-finance',
    title: 'Accounting & Financial Tasks',
    description: 'Invoice processing, expense tracking, and financial reporting',
    icon: CreditCard,
    category: 'Finance'
  },
  {
    value: 'hr-recruitment',
    title: 'HR & Recruitment',
    description: 'CV screening, interview scheduling, and employee onboarding',
    icon: Users,
    category: 'Human Resources'
  },
  {
    value: 'appointment-scheduling',
    title: 'Appointment & Calendar Management',
    description: 'Automated booking, reminders, and calendar optimisation',
    icon: Calendar,
    category: 'Operations'
  },
  {
    value: 'sales-crm',
    title: 'Sales & CRM Management',
    description: 'Lead scoring, follow-up automation, and sales pipeline management',
    icon: ShoppingCart,
    category: 'Sales'
  },
  {
    value: 'document-management',
    title: 'Document Processing',
    description: 'Document classification, data extraction, and filing automation',
    icon: Database,
    category: 'Operations'
  },
  {
    value: 'security-monitoring',
    title: 'Security & Compliance',
    description: 'Threat detection, compliance monitoring, and risk assessment',
    icon: Shield,
    category: 'Security'
  }
]

const categories = Array.from(new Set(processOptions.map(option => option.category)))

export default function BusinessProcessStep({ data, updateData }: BusinessProcessStepProps) {
  const handleProcessToggle = (processValue: string, checked: boolean) => {
    const currentProcesses = data.businessProcesses || []
    if (checked) {
      updateData({ businessProcesses: [...currentProcesses, processValue] })
    } else {
      updateData({ businessProcesses: currentProcesses.filter(p => p !== processValue) })
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
          Which business processes could benefit from AI?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select all areas where you spend significant time on repetitive tasks. We'll focus our recommendations on these areas.
        </p>
      </div>

      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-teal-600 text-center border-b-2 border-teal-200 pb-2">
            {category}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {processOptions
              .filter(option => option.category === category)
              .map((option) => {
                const isChecked = data.businessProcesses?.includes(option.value) || false
                return (
                  <div 
                    key={option.value} 
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isChecked 
                        ? 'border-teal-600 bg-teal-100' 
                        : 'border-teal-200 bg-teal-50 hover:border-teal-400'
                    }`}
                    onClick={() => handleProcessToggle(option.value, !isChecked)}
                  >
                    <Checkbox
                      id={option.value}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleProcessToggle(option.value, checked === true)}
                      className="mt-1 border-teal-500 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <option.icon className="h-4 w-4 text-teal-600" />
                        <Label
                          htmlFor={option.value}
                          className="font-medium text-gray-900 cursor-pointer"
                        >
                          {option.title}
                        </Label>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      ))}

      <div className="text-center mt-8">
        <p className="text-sm text-teal-700 bg-teal-50 inline-block px-6 py-3 rounded-lg border border-teal-200">
          Don't see your specific process? Don't worry! Many AI solutions can be adapted to unique business needs. We'll include custom recommendations in your report.
        </p>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Selected: <strong className="text-teal-600">{data.businessProcesses?.length || 0}</strong> processes
        </p>
      </div>
    </div>
  )
}

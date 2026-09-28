'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User, Building2, Globe, Mail, FileText, Clock } from 'lucide-react'
import { AssessmentData } from './assessment-flow'

interface ContactInfoStepProps {
  data: AssessmentData
  updateData: (data: Partial<AssessmentData>) => void
}

export default function ContactInfoStep({ data, updateData }: ContactInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-teal-600 animate-pulse" />
          <span className="text-sm text-teal-600 font-medium">3 minute assessment</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-teal-600 mb-2">
          Let's get started
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We need some basic information to personalise your assessment results.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
            Full name *
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
            <Input
              id="fullName"
              type="text"
              value={data.fullName}
              onChange={(e) => updateData({ fullName: e.target.value })}
              placeholder="Enter your full name"
              className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position" className="text-sm font-medium text-gray-700">
            Position/Role *
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
            <Input
              id="position"
              type="text"
              value={data.position}
              onChange={(e) => updateData({ position: e.target.value })}
              placeholder="e.g., CEO, Manager, Founder"
              className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company name *
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
            <Input
              id="companyName"
              type="text"
              value={data.companyName}
              onChange={(e) => updateData({ companyName: e.target.value })}
              placeholder="Your organisation name"
              className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyUrl" className="text-sm font-medium text-gray-700">
            Company website *
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
            <Input
              id="companyUrl"
              type="url"
              value={data.companyUrl}
              onChange={(e) => updateData({ companyUrl: e.target.value })}
              placeholder="https://yourcompany.com"
              className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address <span className="text-gray-400">(Optional)</span>
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-teal-500" />
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="your@email.com"
              className="pl-10 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
            />
          </div>
        </div>

      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700">
          Additional information <span className="text-gray-400">(Optional)</span>
        </Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-teal-500" />
          <Textarea
            id="additionalInfo"
            value={data.additionalInfo || ''}
            onChange={(e) => updateData({ additionalInfo: e.target.value })}
            placeholder="Any specific goals, challenges, or context you'd like us to consider..."
            className="pl-10 min-h-[80px] border-teal-200 focus:border-teal-500 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-teal-700 bg-teal-50 inline-block px-6 py-3 rounded-lg border border-teal-200">
          Your information is secure and will only be used to generate your personalised AI assessment report. We never sell or share your data.
        </p>
      </div>
    </div>
  )
}

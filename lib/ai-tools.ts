
export interface AITool {
  name: string
  category: string
  freeTier: boolean
  paidPlanStart: string
  url: string
  description: string
  keyFeatures: string[]
  isAiConsultancy?: boolean // Flag for our own solutions
}

// AiConsultancy's own affordable solutions
export const aiConsultancySolutions: AITool[] = [
  {
    name: 'AiCloneExpert',
    category: 'Personalised AI chatbots',
    freeTier: false,
    paidPlanStart: '£45/month',
    url: 'https://AiCloneExpert.com',
    description: '24/7 personalised chatbots trained on your business knowledge. Handle customer enquiries, qualify leads, and provide instant support around the clock without hiring additional staff.',
    keyFeatures: [
      'Custom-trained on your FAQs and business information',
      'Instant responses 24 hours a day, 7 days a week',
      'Seamless handover to human staff when needed',
      'Multi-channel deployment (website, social media)',
      'Lead capture and qualification'
    ],
    isAiConsultancy: true
  },
  {
    name: 'MediaManagerPro',
    category: 'Social media management',
    freeTier: false,
    paidPlanStart: '£29/month',
    url: 'https://MediaManagerPro.com',
    description: 'Powerful social media scheduling and content management. Plan, create, and publish across all platforms from one dashboard. Built for busy business owners who need results without complexity.',
    keyFeatures: [
      'Schedule posts across all major platforms',
      'AI-assisted caption and hashtag suggestions',
      'Visual content calendar',
      'Performance analytics and reporting',
      'Team collaboration tools'
    ],
    isAiConsultancy: true
  },
  {
    name: 'AiTaskNavigator',
    category: 'AI call handling and automation',
    freeTier: false,
    paidPlanStart: '£75/month',
    url: 'https://AiTaskNavigator.com',
    description: '24/7 AI-powered conversational call agents and automation. Never miss a call again. Our AI handles enquiries, books appointments, and routes calls intelligently while you focus on your business.',
    keyFeatures: [
      'Intelligent call answering and routing',
      'Appointment booking and calendar integration',
      'Lead qualification and data capture',
      'Natural conversational AI voice',
      'Call summaries and transcriptions'
    ],
    isAiConsultancy: true
  }
]

// Research-backed statistics from Harvard/Perplexity AI Agent Study 2026
export const aiResearchInsights = {
  productivityTaskShare: '57%', // Productivity & Workflow + Learning & Research
  topUseCases: ['Document editing (8%)', 'Research (8%)', 'Account management (7%)', 'Email management'],
  marketGrowth: {
    current: '£6.4 billion (2025)',
    projected: '£159 billion by 2034',
    economicImpact: '£2.1-3.5 trillion annually by 2030'
  },
  adoptionLeaders: ['Digital technology (28%)', 'Academia', 'Finance', 'Marketing', 'Entrepreneurship'],
  productivityGains: '47% average improvement',
  timeSaved: '15-20 hours weekly'
}

export const topAITools: AITool[] = [
  {
    name: 'ChatGPT',
    category: 'AI assistant and content generation',
    freeTier: true,
    paidPlanStart: '£16/month',
    url: 'https://chat.openai.com',
    description: 'Leading conversational AI for writing, research, coding, and problem-solving. Featured in 2026 research as a top productivity enabler.',
    keyFeatures: [
      'Natural language processing for complex queries',
      'Code generation and debugging assistance',
      'Content creation and editing',
      'Data analysis and visualisation',
      'Multi-language support'
    ]
  },
  {
    name: 'Claude',
    category: 'AI assistant and enterprise productivity',
    freeTier: true,
    paidPlanStart: '£16/month (Pro)',
    url: 'https://claude.ai',
    description: 'Anthropic\'s AI assistant excelling at nuanced analysis, coding, and document work. Per 2026 research, used heavily in knowledge-intensive sectors.',
    keyFeatures: [
      'Extended context window (200K tokens)',
      'Claude Code for software development',
      'Computer Use for task automation',
      'Document analysis and synthesis',
      'Safe, nuanced responses'
    ]
  },
  {
    name: 'Genspark',
    category: 'AI-powered search and research',
    freeTier: true,
    paidPlanStart: 'Free',
    url: 'https://www.genspark.ai',
    description: 'Next-generation AI search engine that provides comprehensive, unbiased answers with cited sources.',
    keyFeatures: [
      'Advanced research capabilities',
      'Customisable search agents',
      'Source verification and citation',
      'Visual knowledge graphs',
      'Export and sharing options'
    ]
  },
  {
    name: 'Google NotebookLM',
    category: 'Research and document analysis',
    freeTier: true,
    paidPlanStart: 'Free',
    url: 'https://notebooklm.google',
    description: 'AI-powered note-taking and research assistant that helps you synthesise information from multiple sources.',
    keyFeatures: [
      'Document upload and analysis',
      'Automatic summarisation',
      'Source-grounded responses',
      'Interactive Q&A with your documents',
      'Note organisation and synthesis'
    ]
  },
  {
    name: 'Perplexity',
    category: 'AI search, research and agentic AI',
    freeTier: true,
    paidPlanStart: '£16/month (Pro), £160/month (Max)',
    url: 'https://www.perplexity.ai',
    description: 'AI-powered answer engine with agentic capabilities. Per Harvard/Perplexity 2026 research, AI agents handle 57% productivity tasks and are projected to reach £3.5 trillion economic impact by 2030.',
    keyFeatures: [
      'Real-time web search with cited sources',
      'Comet AI browser with autonomous agent',
      'Task automation (scheduling, emails, bookings)',
      'Collections for organised research',
      'Multi-step agentic workflow execution'
    ]
  },
  {
    name: 'Notion',
    category: 'Productivity and knowledge management',
    freeTier: true,
    paidPlanStart: '£8/month',
    url: 'https://www.notion.so',
    description: 'All-in-one workspace with AI capabilities for notes, documents, databases, and project management.',
    keyFeatures: [
      'AI-powered writing assistance',
      'Automatic content generation',
      'Smart database views',
      'Team collaboration tools',
      'Template library'
    ]
  },
  {
    name: 'Slack',
    category: 'Team communication and collaboration',
    freeTier: true,
    paidPlanStart: '£5.25/month',
    url: 'https://slack.com',
    description: 'Business communication platform with AI features for workflow automation and intelligent search.',
    keyFeatures: [
      'AI-powered search and summaries',
      'Workflow automation',
      'Channel organisation',
      'Integration with 2,000+ apps',
      'Video and voice calls'
    ]
  },
  {
    name: 'Zapier',
    category: 'Workflow automation',
    freeTier: true,
    paidPlanStart: '£16/month',
    url: 'https://zapier.com',
    description: 'Connect and automate workflows between 5,000+ apps without coding.',
    keyFeatures: [
      'No-code automation builder',
      '5,000+ app integrations',
      'Multi-step workflows',
      'AI-powered automation suggestions',
      'Error handling and monitoring'
    ]
  },
  {
    name: 'Grammarly',
    category: 'Writing and communication',
    freeTier: true,
    paidPlanStart: '£10/month',
    url: 'https://www.grammarly.com',
    description: 'AI writing assistant for grammar, spelling, tone, and style improvement across all platforms.',
    keyFeatures: [
      'Real-time grammar and spelling checks',
      'Tone detection and suggestions',
      'Plagiarism detection',
      'Brand voice consistency',
      'Browser extension and desktop app'
    ]
  },
  {
    name: 'Canva',
    category: 'Graphic design and visual content',
    freeTier: true,
    paidPlanStart: '£10/month',
    url: 'https://www.canva.com',
    description: 'Design platform with AI-powered tools for creating professional graphics, presentations, and videos.',
    keyFeatures: [
      'Magic Design for instant layouts',
      'Background removal',
      'Brand kit management',
      'Template library (100,000+)',
      'Team collaboration'
    ]
  },
  {
    name: 'Fireflies.ai',
    category: 'Meeting transcription and notes',
    freeTier: true,
    paidPlanStart: '£8/month',
    url: 'https://fireflies.ai',
    description: 'AI meeting assistant that records, transcribes, and analyses your meetings automatically.',
    keyFeatures: [
      'Automatic meeting transcription',
      'Action item extraction',
      'Meeting summary generation',
      'Integration with video platforms',
      'Searchable meeting database'
    ]
  },
  {
    name: 'Copy.ai',
    category: 'Content creation and copywriting',
    freeTier: true,
    paidPlanStart: '£30/month',
    url: 'https://www.copy.ai',
    description: 'AI-powered platform for generating marketing copy, product descriptions, and social media content.',
    keyFeatures: [
      'Multiple content templates',
      'Brand voice customisation',
      'Multi-language support',
      'SEO optimisation',
      'Team collaboration'
    ]
  },
  {
    name: 'Midjourney',
    category: 'AI image generation',
    freeTier: false,
    paidPlanStart: '£8/month',
    url: 'https://www.midjourney.com',
    description: 'Leading AI image generation tool for creating high-quality artwork and visuals from text prompts.',
    keyFeatures: [
      'High-resolution image generation',
      'Style reference and consistency',
      'Commercial usage rights',
      'Community gallery',
      'Discord-based interface'
    ]
  },
  {
    name: 'Otter.ai',
    category: 'Transcription and note-taking',
    freeTier: true,
    paidPlanStart: '£7/month',
    url: 'https://otter.ai',
    description: 'Real-time transcription service for meetings, interviews, and lectures with AI-powered summaries.',
    keyFeatures: [
      'Live transcription',
      'Speaker identification',
      'Automated meeting notes',
      'Keyword highlighting',
      'Integration with video conferencing'
    ]
  },
  {
    name: 'Jasper',
    category: 'AI content creation',
    freeTier: false,
    paidPlanStart: '£32/month',
    url: 'https://www.jasper.ai',
    description: 'Enterprise-grade AI content platform for creating on-brand marketing content at scale.',
    keyFeatures: [
      'Brand voice training',
      'SEO mode',
      'Content templates (50+)',
      'Team collaboration',
      'Chrome extension'
    ]
  },
  {
    name: 'ElevenLabs',
    category: 'AI voice generation',
    freeTier: true,
    paidPlanStart: '£4/month',
    url: 'https://elevenlabs.io',
    description: 'Advanced AI voice generator for creating realistic text-to-speech and voice cloning in multiple languages.',
    keyFeatures: [
      'Realistic voice generation',
      'Voice cloning technology',
      '29+ languages supported',
      'Customisable voice parameters',
      'API access for integration'
    ]
  },
  {
    name: 'Pictory',
    category: 'AI video creation',
    freeTier: true,
    paidPlanStart: '£19/month',
    url: 'https://pictory.ai',
    description: 'Transform scripts and blog posts into engaging videos with AI-powered editing and voiceovers.',
    keyFeatures: [
      'Script-to-video conversion',
      'Blog post to video',
      'Automatic caption generation',
      'Stock footage library',
      'Brand customisation'
    ]
  },
  {
    name: 'Synthesia',
    category: 'AI video generation',
    freeTier: false,
    paidPlanStart: '£22/month',
    url: 'https://www.synthesia.io',
    description: 'Create professional AI videos from text with AI avatars and voiceovers in 120+ languages.',
    keyFeatures: [
      '140+ AI avatars',
      '120+ languages and accents',
      'Custom avatar creation',
      'Screen recording',
      'Video editing tools'
    ]
  },
  {
    name: 'Cursor',
    category: 'AI-powered coding and development',
    freeTier: true,
    paidPlanStart: '£16/month (Pro)',
    url: 'https://cursor.sh',
    description: 'AI-first code editor with agentic capabilities. Per Harvard 2026 research, coding assistants show significant productivity gains in software development.',
    keyFeatures: [
      'AI-powered code completion',
      'Codebase-aware suggestions',
      'Multi-file editing',
      'Built-in chat for code questions',
      'Agent mode for autonomous coding'
    ]
  },
  {
    name: 'Microsoft Copilot',
    category: 'Enterprise productivity and Microsoft 365 integration',
    freeTier: true,
    paidPlanStart: '£24/month (Copilot Pro)',
    url: 'https://copilot.microsoft.com',
    description: 'AI assistant integrated across Microsoft 365 apps. Ideal for businesses already using Word, Excel, Outlook, and Teams.',
    keyFeatures: [
      'Document drafting in Word',
      'Data analysis in Excel',
      'Email summarisation in Outlook',
      'Meeting summaries in Teams',
      'PowerPoint presentation creation'
    ]
  }
]

export function getToolsByCategory(category?: string): AITool[] {
  if (!category) return topAITools
  return topAITools.filter(tool => 
    tool.category.toLowerCase().includes(category.toLowerCase())
  )
}

export function getFreeTools(): AITool[] {
  return topAITools.filter(tool => tool.freeTier)
}

export function getPaidTools(): AITool[] {
  return topAITools.filter(tool => !tool.freeTier)
}

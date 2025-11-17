'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, MessageSquare, Zap, Shield, User } from 'lucide-react'
import BackButton from '@/components/back-button'

const faqs = [
  {
    question: "What is Prompt to JSON Converter?",
    answer: "Prompt to JSON Converter is an AI-powered tool that transforms your natural language prompts into structured JSON format. This helps Large Language Models (LLMs) better understand and process your requests, resulting in more accurate and consistent outputs.",
    icon: <Zap className="h-5 w-5" />,
    category: "General"
  },
  {
    question: "How do I convert a prompt to JSON?",
    answer: "Simply type or paste your prompt in the input field and click 'Convert to JSON' button. Our AI will analyze your prompt and automatically structure it into a properly formatted JSON object with relevant metadata.",
    icon: <MessageSquare className="h-5 w-5" />,
    category: "Getting Started"
  },
  {
    question: "Do I need to create an account?",
    answer: "You can use the converter without an account, but creating an account allows you to save your conversion history, access your saved prompts from any device, and manage your library of structured prompts.",
    icon: <User className="h-5 w-5" />,
    category: "Account"
  },
  {
    question: "How do I save my conversions?",
    answer: "After signing in, convert a prompt and then click 'Save' button. You can add a description to help you remember the purpose of each conversion. All saved items appear in the 'History' tab.",
    icon: <Shield className="h-5 w-5" />,
    category: "Features"
  },
  {
    question: "Can I edit my saved conversions?",
    answer: "Yes! Click on any item in your History tab to load it back into the converter. You can then modify the prompt or JSON output and save it as a new conversion or update the existing one.",
    icon: <MessageSquare className="h-5 w-5" />,
    category: "Features"
  },
  {
    question: "What makes a good prompt for conversion?",
    answer: "A good prompt is specific, clear, and provides context. Include details about the desired output format, constraints, examples, or specific domain. The more information you provide, the better the structured JSON will be.",
    icon: <HelpCircle className="h-5 w-5" />,
    category: "Tips"
  },
  {
    question: "How do I copy or download the JSON output?",
    answer: "Use the 'Copy JSON' button to copy the structured output to your clipboard, or click 'Download' button to save it as a .json file. Both options are available in the output section.",
    icon: <Zap className="h-5 w-5" />,
    category: "Features"
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely! All conversions are stored securely in your personal account and are only accessible to you. We use industry-standard encryption and authentication to protect your data. You can delete your account and all associated data at any time.",
    icon: <Shield className="h-5 w-5" />,
    category: "Security"
  },
  {
    question: "What should I do if conversion doesn't work as expected?",
    answer: "Try rephrasing your prompt with more specific details. Include examples of the desired output format, specify the task type, or provide context about your use case. You can also edit the generated JSON manually if needed.",
    icon: <HelpCircle className="h-5 w-5" />,
    category: "Troubleshooting"
  }
]

const categories = ["General", "Getting Started", "Account", "Features", "Tips", "Security", "Troubleshooting"]

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header with Back Button */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Everything you need to know about Prompt to JSON Converter
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid gap-8">
          {categories.map((category) => (
            <Card key={category} className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">{category}</Badge>
                </CardTitle>
                <CardDescription>
                  Common questions about {category.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible className="w-full">
                  {faqs
                    .filter((faq) => faq.category === category)
                    .map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left hover:no-underline">
                          <div className="flex items-center gap-3">
                            {faq.icon}
                            <span className="font-medium">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 pb-2 text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Help */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Contact Support</h4>
                <p className="text-sm text-muted-foreground">
                  Reach out to our support team for personalized assistance with your specific use case.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Join Community</h4>
                <p className="text-sm text-muted-foreground">
                  Connect with other users to share tips, tricks, and best practices for prompt engineering.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
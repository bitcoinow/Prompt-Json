'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowRight, 
  CheckCircle, 
  Copy, 
  Download, 
  FileText, 
  HelpCircle, 
  Lightbulb, 
  MessageSquare, 
  Save, 
  Settings, 
  User, 
  Wand2,
  Zap
} from 'lucide-react'
import BackButton from '@/components/back-button'

const steps = [
  {
    id: "getting-started",
    title: "Getting Started",
    description: "Learn the basics and start converting your first prompt",
    icon: <Wand2 className="h-8 w-8" />,
    steps: [
      {
        title: "Create Your Account",
        description: "Sign up for a free account to save your conversion history and access your prompts from anywhere.",
        action: "Click 'Sign In' and create your account"
      },
      {
        title: "Enter Your Prompt",
        description: "Type or paste your natural language prompt in the input field. Be specific and clear about what you want.",
        action: "Type your prompt in the main text area"
      },
      {
        title: "Convert to JSON",
        description: "Click the 'Convert to JSON' button and our AI will structure your prompt into a proper JSON format.",
        action: "Click the 'Convert to JSON' button"
      }
    ]
  },
  {
    id: "saving-managing",
    title: "Saving & Managing",
    description: "Learn how to save, organize, and manage your prompt conversions",
    icon: <Save className="h-8 w-8" />,
    steps: [
      {
        title: "Save Your Work",
        description: "After converting a prompt, click 'Save' to store it in your personal library. Add descriptions to remember the purpose.",
        action: "Click 'Save' button after conversion"
      },
      {
        title: "View History",
        description: "Access all your saved conversions in the History tab. Sort by date or search for specific prompts.",
        action: "Click on 'History' tab to view saved items"
      },
      {
        title: "Edit Conversions",
        description: "Load any saved conversion back into the editor to modify the prompt or JSON output.",
        action: "Click on any saved item to edit it"
      },
      {
        title: "Delete Unwanted Items",
        description: "Remove conversions you no longer need from your library with one click.",
        action: "Click the trash icon to delete items"
      }
    ]
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    description: "Explore powerful features to enhance your workflow",
    icon: <Settings className="h-8 w-8" />,
    steps: [
      {
        title: "Copy to Clipboard",
        description: "Quickly copy the JSON output to your clipboard with multiple fallback methods for reliability.",
        action: "Click 'Copy JSON' button"
      },
      {
        title: "Download JSON Files",
        description: "Export your structured JSON as downloadable files for use in other applications or projects.",
        action: "Click 'Download' button to save as .json"
      },
      {
        title: "Theme Switching",
        description: "Toggle between light and dark themes for comfortable viewing in any environment.",
        action: "Click the moon/sun icon in the header"
      },
      {
        title: "User Profile",
        description: "Manage your account settings, view your profile information, and sign out securely.",
        action: "Click on your avatar in the top-right"
      }
    ]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Tips and techniques for getting the best results from your conversions",
    icon: <Lightbulb className="h-8 w-8" />,
    steps: [
      {
        title: "Be Specific",
        description: "Include clear details about the desired output format, constraints, examples, or specific domain in your prompts.",
        action: "Add specific requirements and examples"
      },
      {
        title: "Provide Context",
        description: "Give background information about your use case to help the AI understand the purpose better.",
        action: "Explain your use case and goals"
      },
      {
        title: "Iterate and Refine",
        description: "Start with a basic prompt, then refine it based on the AI's output to improve results.",
        action: "Edit and improve your prompts progressively"
      },
      {
        title: "Use Descriptions",
        description: "Add meaningful descriptions when saving conversions to remember the context and purpose later.",
        action: "Write clear descriptions for each saved item"
      }
    ]
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    description: "Solutions to common issues and how to resolve them",
    icon: <HelpCircle className="h-8 w-8" />,
    steps: [
      {
        title: "Conversion Fails",
        description: "If the AI doesn't convert your prompt properly, try rephrasing with more specific details.",
        action: "Rewrite your prompt with more clarity"
      },
      {
        title: "Can't Save",
        description: "Make sure you're signed in with a valid account before attempting to save conversions.",
        action: "Check your authentication status"
      },
      {
        title: "Copy Issues",
        description: "If copying to clipboard fails, use the 'Select Text' button or manually select the JSON text.",
        action: "Use alternative copy methods"
      },
      {
        title: "Slow Performance",
        description: "Try refreshing the page or checking your internet connection if the app feels slow.",
        action: "Refresh the page or check connection"
      }
    ]
  }
]

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <h1 className="text-4xl font-bold tracking-tight">How to Use Prompt to JSON Converter</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Step-by-step guide to master the art of prompt engineering
          </p>
        </div>

        {/* Quick Start */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6" />
              Quick Start
            </CardTitle>
            <CardDescription>
              New to the app? Follow these simple steps to get started immediately.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium">Sign Up or Sign In</h4>
                    <p className="text-sm text-muted-foreground">
                      Create your account or sign in to access all features.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium">Enter Your Prompt</h4>
                    <p className="text-sm text-muted-foreground">
                      Type or paste your prompt in the main text area.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium">Convert & Save</h4>
                    <p className="text-sm text-muted-foreground">
                      Click convert, then save your result to build your library.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button onClick={() => window.location.href = '/'} className="w-full md:w-auto">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Guide */}
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {steps.map((step) => (
              <TabsTrigger key={step.id} value={step.id} className="flex items-center gap-2">
                {step.icon}
                <span className="hidden sm:inline">{step.title}</span>
                <span className="sm:hidden">{step.title.split(' ')[0]}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {steps.map((step) => (
            <TabsContent key={step.id} value={step.id} className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {step.icon}
                    {step.title}
                  </CardTitle>
                  <CardDescription>
                    {step.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {step.steps.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{instruction.title}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {instruction.description}
                        </p>
                        <div className="mt-2 p-3 bg-muted rounded-md">
                          <p className="text-xs font-medium">
                            <strong>Action:</strong> {instruction.action}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Tips */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Pro Tips
            </CardTitle>
            <CardDescription>
              Advanced techniques to get the most out of your prompt conversions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Use Examples
                </h4>
                <p className="text-sm text-muted-foreground">
                  Include specific examples in your prompts to guide the AI toward your desired output format.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Specify Format
                </h4>
                <p className="text-sm text-muted-foreground">
                  Clearly state the JSON structure you want, including field names, data types, and nesting.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Iterate & Refine
                </h4>
                <p className="text-sm text-muted-foreground">
                  Start simple and gradually add complexity based on the AI's responses.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Test & Validate
                </h4>
                <p className="text-sm text-muted-foreground">
                  Test your JSON output in your applications to ensure it works as expected.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Our support team is here to assist you with any questions or issues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Email Support</h4>
                <p className="text-sm text-muted-foreground">
                  Reach out for personalized help with your specific use cases or technical issues.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Community Forum</h4>
                <p className="text-sm text-muted-foreground">
                  Share tips, tricks, and success stories with other users.
                </p>
                <Button variant="outline" className="w-full">
                  Join Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
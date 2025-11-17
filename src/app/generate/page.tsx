'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  AlertCircle, 
  Download, 
  RefreshCw, 
  Wand2,
  Zap
} from 'lucide-react'
import BackButton from '@/components/back-button'
import { useToast } from '@/hooks/use-toast'

interface GenerationData {
  prompt: string
  jsonOutput: string
  timestamp: string
  error?: string
}

export default function GenerationPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generation, setGeneration] = useState<GenerationData | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  const generateJSON = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate JSON",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setGeneration(null)
    setRetryCount(0)

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Generation failed')
      }

      const data = await response.json()
      
      setGeneration({
        prompt,
        jsonOutput: data.jsonOutput,
        timestamp: new Date().toISOString(),
      })

      toast({
        title: "Success",
        description: "JSON generated successfully!",
      })
    } catch (error) {
      console.error('Generation error:', error)
      
      setGeneration({
        prompt,
        jsonOutput: '',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      })

      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate JSON",
        variant: "destructive",
        action: (
          <Button size="sm" onClick={() => setRetryCount(prev => prev + 1)}>
            Retry
          </Button>
        ),
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadJSON = () => {
    if (!generation?.jsonOutput) return

    const blob = new Blob([generation.jsonOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Download Started",
      description: "Your JSON file is being downloaded",
    })
  }

  const copyToClipboard = async () => {
    if (!generation?.jsonOutput) return

    try {
      await navigator.clipboard.writeText(generation.jsonOutput)
      toast({
        title: "Copied!",
        description: "JSON output copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const tryAgain = () => {
    setGeneration(null)
    setRetryCount(0)
    setPrompt('')
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton />
            <h1 className="text-4xl font-bold tracking-tight">Generate JSON</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Transform your prompts into structured JSON format
          </p>
        </div>

        {/* Generation Form */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Enter Your Prompt
            </CardTitle>
            <CardDescription>
              Describe what you want to convert to JSON format
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="prompt" className="text-sm font-medium">
                Your Prompt
              </label>
              <Textarea
                id="prompt"
                placeholder="Enter your prompt here... For example: 'Create a user profile with fields for name, email, age, and preferences'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-32 resize-none"
                disabled={isGenerating}
              />
            </div>
            
            <Button 
              onClick={generateJSON}
              disabled={isGenerating || !prompt.trim()}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate JSON
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generation Result */}
        {generation && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {generation.error ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    Generation Failed
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 text-green-600" />
                    Generation Complete
                  </>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant={generation.error ? "destructive" : "default"}>
                    {generation.error ? 'Error' : 'Success'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(generation.timestamp).toLocaleString()}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {generation.error ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="font-medium text-red-800 mb-2">Error Details</h4>
                    <p className="text-red-700 text-sm">{generation.error}</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h4 className="font-medium text-yellow-800 mb-2">Troubleshooting Tips</h4>
                    <ul className="text-sm text-yellow-700 space-y-2">
                      <li>• Check your internet connection</li>
                      <li>• Try a simpler prompt</li>
                      <li>• Make sure your prompt is clear and specific</li>
                      <li>• Wait a few moments and try again</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div>
                      <h4 className="font-medium">Original Prompt</h4>
                      <div className="p-3 bg-muted rounded-md">
                        <p className="text-sm">{generation.prompt}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Generated JSON</h4>
                      <div className="p-3 bg-muted rounded-md">
                        <pre className="text-xs bg-background p-3 rounded border overflow-x-auto max-h-64">
                          {generation.jsonOutput}
                        </pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button onClick={copyToClipboard} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Copy JSON
                    </Button>
                    
                    <Button onClick={downloadJSON} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </Button>
                    
                    <Button onClick={tryAgain} variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Try Again
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Retry Information */}
        {retryCount > 0 && (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Retry Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  You've retried <strong>{retryCount}</strong> time{retryCount !== 1 ? 's' : ''}. 
                  {retryCount >= 3 && (
                    <> If you continue to experience issues, please contact our support team for assistance.</>
                  )}
                </p>
                
                {retryCount >= 3 && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/faq'}>
                        Visit FAQ
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => window.location.href = '/pricing'}>
                        Upgrade Plan
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tips */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Be Specific</h4>
                <p className="text-sm text-muted-foreground">
                  Include clear details about the desired JSON structure, field names, and data types.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Provide Context</h4>
                <p className="text-sm text-muted-foreground">
                  Give background information about your use case to help the AI understand the purpose.
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Use Examples</h4>
                <p className="text-sm text-muted-foreground">
                  Include examples of the desired output format to guide the AI toward your goal.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { 
  Wand2, 
  Save, 
  Copy, 
  History, 
  Trash2, 
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Moon,
  Sun,
  User,
  LogOut,
  Crown,
  HelpCircle,
  MessageSquare
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import UserProfile from '@/components/user-profile'

interface PromptConversion {
  id: string
  original_prompt: string
  json_output: string
  description?: string
  created_at: string
  updated_at: string
}

export default function PromptToJSONConverter() {
  const { user, loading: authLoading, signOut, isDemo } = useAuth()
  const [prompt, setPrompt] = useState('')
  const [jsonOutput, setJsonOutput] = useState('')
  const [description, setDescription] = useState('')
  const [history, setHistory] = useState<PromptConversion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const { toast } = useToast()

// Load history on component mount and when user changes
  useEffect(() => {
    if (user) {
      loadHistory()
    } else {
      setHistory([])
    }
  }, [user])

  // Check for saved theme preference or default to light mode
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark))
  }, [])

  // Apply theme changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  const loadHistory = async () => {
    if (!user) return
    
    try {
      // Get the session token to send with the request
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch('/api/conversions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Load history error:', errorData)
        return
      }
      
      const data = await response.json()
      setHistory(data || [])
    } catch (error) {
      console.error('Failed to load history:', error)
      setHistory([])
    }
  }

  const convertPrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to convert",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (response.ok) {
        const data = await response.json()
        setJsonOutput(data.jsonOutput)
        toast({
          title: "Success",
          description: "Prompt converted to JSON successfully",
        })
      } else {
        throw new Error('Conversion failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to convert prompt to JSON",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const saveConversion = async () => {
    if (!prompt.trim() || !jsonOutput.trim()) {
      toast({
        title: "Error",
        description: "Please convert a prompt before saving",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save conversions",
        variant: "destructive",
        action: (
          <Button size="sm" onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        ),
      })
      return
    }

    setIsSaving(true)
    try {
      // Get the session token to send with the request
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch('/api/conversions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          original_prompt: prompt,
          json_output: jsonOutput,
          description,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('Save error response:', responseData)
        throw new Error(responseData.error || 'Save failed')
      }

      toast({
        title: "Success",
        description: "Conversion saved successfully",
      })
      setDescription('')
      loadHistory()
    } catch (error) {
      console.error('Save conversion error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save conversion",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const copyToClipboard = async (text: string, event?: React.MouseEvent | React.KeyboardEvent) => {
    if (!text || text.trim() === '') {
      toast({
        title: "Error",
        description: "Nothing to copy - JSON output is empty",
        variant: "destructive",
      })
      return
    }

    // Prevent default behavior and stop propagation
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Helper function to try copying with different methods
    const tryCopy = async (content: string): Promise<boolean> => {
      try {
        // Method 1: Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(content)
          return true
        }
      } catch (e) {
        console.log('Clipboard API failed:', e)
      }

      try {
        // Method 2: Create temporary element
        const textArea = document.createElement('textarea')
        textArea.value = content
        textArea.style.cssText = `
          position: fixed;
          top: -9999px;
          left: -9999px;
          width: 2em;
          height: 2em;
          padding: 0;
          border: none;
          outline: none;
          box-shadow: none;
          background: transparent;
          opacity: 0;
          pointer-events: none;
        `
        
        document.body.appendChild(textArea)
        
        // Small delay to ensure element is ready
        await new Promise(resolve => setTimeout(resolve, 10))
        
        textArea.focus()
        textArea.select()
        textArea.setSelectionRange(0, 99999)
        
        const successful = document.execCommand('copy')
        document.body.removeChild(textArea)
        
        return successful
      } catch (e) {
        console.log('Fallback copy failed:', e)
        return false
      }
    }

    try {
      // Try direct copy first
      const success = await tryCopy(text)
      
      if (success) {
        setCopied(true)
        toast({
          title: "Success",
          description: "JSON copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
        return
      }

      // Fallback: try to select and copy from the visible textarea
      const jsonOutputElement = document.querySelector('textarea[placeholder*="JSON output"]') as HTMLTextAreaElement
      if (jsonOutputElement) {
        jsonOutputElement.focus()
        jsonOutputElement.select()
        jsonOutputElement.setSelectionRange(0, 99999)
        
        // Small delay before trying to copy
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const fallbackSuccess = await tryCopy(jsonOutputElement.value)
        if (fallbackSuccess) {
          setCopied(true)
          toast({
            title: "Success",
            description: "JSON copied to clipboard",
          })
          setTimeout(() => setCopied(false), 2000)
          return
        }
      }

      // If all methods fail, show helpful error
      throw new Error('All copy methods failed')
      
    } catch (error) {
      console.error('Copy error:', error)
      
      toast({
        title: "Copy Failed",
        description: "Please select JSON text and press Ctrl+C (Cmd+C on Mac) to copy",
        variant: "destructive",
        action: (
          <Button
            size="sm"
            onClick={() => {
              const jsonOutputElement = document.querySelector('textarea[placeholder*="JSON output"]') as HTMLTextAreaElement
              if (jsonOutputElement) {
                jsonOutputElement.focus()
                jsonOutputElement.select()
                jsonOutputElement.setSelectionRange(0, 99999)
              }
            }}
          >
            Select Text
          </Button>
        ),
      })
    }
  }

  const deleteConversion = async (id: string) => {
    try {
      // Get the session token to send with the request
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token

      const response = await fetch(`/api/conversions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Conversion deleted successfully",
        })
        loadHistory()
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete conversion",
        variant: "destructive",
      })
    }
  }

  const loadConversion = (conversion: PromptConversion) => {
    setPrompt(conversion.original_prompt)
    setJsonOutput(conversion.json_output)
    setDescription(conversion.description || '')
  }

  const downloadJSON = () => {
    if (!jsonOutput.trim()) return
    
    const blob = new Blob([jsonOutput], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-conversion-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const clearAll = () => {
    setPrompt('')
    setJsonOutput('')
    setDescription('')
  }

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Success",
      description: "Signed out successfully",
    })
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">Prompt to JSON Converter</h1>
            <p className="text-muted-foreground text-lg">
              Loading...
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Show main app (allow access without authentication for now)
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-between items-center mb-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user.user_metadata?.full_name && (
                        <p className="font-medium">{user.user_metadata?.full_name}</p>
                      )}
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      {isDemo && (
                        <p className="text-xs text-blue-600 font-medium">Demo Mode</p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => window.location.href = '/pricing'}>
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade Plan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/generate'}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.location.href = '/faq'}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  FAQ
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/how-to-use'}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  How to Use
                </Button>
              </div>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Prompt to JSON Converter</h1>
          <p className="text-muted-foreground text-lg">
            Convert your prompts into structured JSON format for better LLM understanding
          </p>
          {!user && (
            <div className="mt-4 space-y-2">
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In to Save History
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                <Crown className="mr-2 h-4 w-4" />
                View Pricing
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="converter" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="converter">Converter</TabsTrigger>
            <TabsTrigger value="history">History ({history.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="converter" className="space-y-6">
            {/* Main Converter */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Input Prompt
                  </CardTitle>
                  <CardDescription>
                    Enter your prompt that you want to convert to JSON format
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your prompt here... For example: 'Create a user profile with name, email, and age fields'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-32 resize-none"
                  />
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={convertPrompt} 
                      disabled={isLoading || !prompt.trim()}
                      className="flex-1 shadow-md hover:shadow-lg transition-shadow"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Converting...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Convert to JSON
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={clearAll}>
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Output Section */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    JSON Output
                  </CardTitle>
                  <CardDescription>
                    Structured JSON format of your prompt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="JSON output will appear here..."
                    value={jsonOutput}
                    onChange={(e) => setJsonOutput(e.target.value)}
                    className="min-h-32 resize-none font-mono-custom text-sm"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={(e) => copyToClipboard(jsonOutput, e)}
                      disabled={!jsonOutput.trim()}
                      className="flex-1"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy JSON
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={downloadJSON}
                      disabled={!jsonOutput.trim()}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                  
                  {/* Alternative copy method for mouse users */}
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const textArea = document.createElement('textarea')
                        textArea.value = jsonOutput
                        textArea.style.position = 'fixed'
                        textArea.style.left = '0'
                        textArea.style.top = '0'
                        textArea.style.width = '1px'
                        textArea.style.height = '1px'
                        textArea.style.padding = '0'
                        textArea.style.border = 'none'
                        textArea.style.outline = 'none'
                        textArea.style.boxShadow = 'none'
                        textArea.style.background = 'transparent'
                        document.body.appendChild(textArea)
                        textArea.select()
                        document.execCommand('copy')
                        document.body.removeChild(textArea)
                        setCopied(true)
                        toast({
                          title: "Success",
                          description: "JSON copied to clipboard",
                        })
                        setTimeout(() => setCopied(false), 2000)
                      }}
                      disabled={!jsonOutput.trim()}
                      className="text-xs text-muted-foreground"
                    >
                      📋 Alternative Copy (if above doesn't work)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Section */}
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Save Conversion
                </CardTitle>
                <CardDescription>
                  Save this conversion to your history for future reference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Add a description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button 
                  onClick={saveConversion} 
                  disabled={isSaving || !prompt.trim() || !jsonOutput.trim()}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save to History
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Conversion History
                </CardTitle>
                <CardDescription>
                  Your saved prompt-to-JSON conversions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <p>No conversions saved yet</p>
                    <p className="text-sm">Start converting and saving your prompts!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {history.map((conversion) => (
                        <Card key={conversion.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-2">
                                {conversion.description && (
                                  <Badge variant="secondary" className="mb-2">
                                    {conversion.description}
                                  </Badge>
                                )}
                                <div className="text-sm text-muted-foreground">
                                  {new Date(conversion.created_at).toLocaleString()}
                                </div>
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => loadConversion(conversion)}
                                >
                                  Load
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => copyToClipboard(conversion.json_output, e)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteConversion(conversion.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="space-y-2">
                              <div>
                                <div className="text-sm font-medium mb-1">Original Prompt:</div>
                                <div className="text-sm bg-muted p-2 rounded">
                                  {conversion.original_prompt}
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium mb-1">JSON Output:</div>
                                <div className="text-sm bg-muted p-2 rounded font-mono max-h-32 overflow-y-auto">
                                  {conversion.json_output}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
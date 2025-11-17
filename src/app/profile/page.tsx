'use client'

import { useAuth } from '@/contexts/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  Crown,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, isDemo } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Profile Not Available</h1>
            <p className="text-muted-foreground">Please sign in to view your profile.</p>
            <Link href="/auth">
              <Button>
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {user.email}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Demo Mode Badge */}
            {isDemo && (
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <User className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Demo Mode Active</h3>
                    <p className="text-sm">
                      You're currently using the app in demo mode. Profile information is simulated.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Information
              </h3>
              
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <p className="font-medium">
                    {user.user_metadata?.full_name || 'Not provided'}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    {user.id}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                  <div className="flex items-center gap-2">
                    {isDemo ? (
                      <Badge variant="secondary">Demo User</Badge>
                    ) : (
                      <Badge variant="outline">Free Plan</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Actions
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/pricing" className="flex-1">
                  <Button className="w-full" variant="outline">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Plan
                  </Button>
                </Link>
                
                <Link href="/auth" className="flex-1">
                  <Button className="w-full" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Account Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Account Status
              </h3>
              
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge variant={isDemo ? "secondary" : "default"}>
                      {isDemo ? "Demo Mode" : "Active"}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Authentication</span>
                    <Badge variant="outline">Authenticated</Badge>
                  </div>
                  
                  {isDemo && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      <p>
                        <strong>Note:</strong> In demo mode, your session is temporary and will be lost when you refresh the page.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
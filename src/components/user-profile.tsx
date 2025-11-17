'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'
import { LogOut, User } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    await signOut()
    toast({
      title: "Success",
      description: "Signed out successfully",
    })
    setLoading(false)
  }

  if (!user) return null

  return (
    <Card className="w-full max-w-sm shadow-md">
      <CardHeader className="text-center">
        <CardTitle className="text-lg">Profile</CardTitle>
        <CardDescription>
          {user.email}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.user_metadata?.avatar_url} alt="Profile" />
            <AvatarFallback className="text-lg">
              {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="text-center space-y-2">
          <div className="font-medium">
            {user.user_metadata?.full_name || 'User'}
          </div>
          <div className="text-sm text-muted-foreground">
            {user.email}
          </div>
        </div>
        
        <Button 
          onClick={handleSignOut} 
          variant="outline" 
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <LogOut className="mr-2 h-4 w-4 animate-spin" />
              Signing Out...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
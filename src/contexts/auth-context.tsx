'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isDemoMode } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isDemo: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string; success?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error?: string; success?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    // Check if we're in demo mode
    const demo = isDemoMode()
    setIsDemo(demo)

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Auth context - getSession result:', { session: session?.user?.email || 'no session' })
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Auth error:', error)
        setSession(null)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Add timeout to prevent hanging but make it longer for reliability
    const timeout = setTimeout(() => {
      console.log('Auth context - timeout triggered after 10 seconds')
      setLoading(false)
    }, 10000) // 10 seconds instead of 3

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth context - state change:', { event: _event, user: session?.user?.email || 'no user' })
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
      // Clear timeout when auth state changes
      if (timeout) {
        clearTimeout(timeout)
      }
    })

    return () => {
      clearTimeout(timeout)
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      console.log('Auth context - signUp attempt:', { email, fullName })
      
      // If in demo mode, simulate successful signup
      if (isDemoMode()) {
        const mockUser = {
          id: 'demo-user-id',
          email: email || 'demo@example.com',
          user_metadata: { full_name: fullName || 'Demo User' }
        }
        setUser(mockUser as any)
        setSession({ user: mockUser } as any)
        return { success: true }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log('Auth context - signUp result:', { data: data?.user?.email || 'no user', error: error?.message || 'no error' })

      if (error) {
        return { error: error.message, success: false }
      }

      return { success: true }
    } catch (error) {
      console.error('Auth context - signUp error:', error)
      return { error: 'An unexpected error occurred', success: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Auth context - signIn attempt:', { email })
      
      // Check if we're in demo mode first
      const demo = isDemoMode()
      console.log('Auth context - demo mode:', demo)
      
      if (demo) {
        console.log('Auth context - using demo mode for sign in')
        const mockUser = {
          id: 'demo-user-id',
          email: email || 'demo@example.com',
          user_metadata: { full_name: 'Demo User' }
        }
        setUser(mockUser as any)
        setSession({ user: mockUser } as any)
        return { success: true }
      }
      
      console.log('Auth context - using real Supabase for sign in')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Auth context - signIn result:', { data: data?.user?.email || 'no user', error: error?.message || 'no error' })

      if (error) {
        return { error: error.message, success: false }
      }

      return { success: true }
    } catch (error) {
      console.error('Auth context - signIn error:', error)
      return { error: 'An unexpected error occurred', success: false }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    session,
    loading,
    isDemo,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
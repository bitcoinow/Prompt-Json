import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Create a mock client if Supabase credentials are not provided
const createMockClient = () => {
  return {
    auth: {
      getSession: () => {
        return Promise.resolve({ data: { session: null }, error: null })
      },
      onAuthStateChange: () => {
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      signUp: async (params: any) => {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'mock-user-id',
              email: params.email || 'demo@example.com',
              user_metadata: { full_name: params.options?.data?.full_name || 'Demo User' }
            } 
          }, 
          error: null 
        })
      },
      signInWithPassword: async (params: any) => {
        return Promise.resolve({ 
          data: { 
            user: { 
              id: 'mock-user-id',
              email: params.email || 'demo@example.com',
              user_metadata: { full_name: 'Demo User' }
            } 
          }, 
          error: null 
        })
      },
      signOut: async () => {
        return Promise.resolve({ error: null })
      },
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Demo mode - no database' } })
        })
      })
    })
  }
}

export const supabase = (supabaseUrl && supabaseUrl.trim() !== '' && supabaseAnonKey && supabaseAnonKey.trim() !== '') 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
    })
  : createMockClient()

// Check if we're using demo mode
export const isDemoMode = () => {
  return !supabaseUrl || supabaseUrl.trim() === '' || !supabaseAnonKey || supabaseAnonKey.trim() === ''
}

// For server-side usage
export function createSupabaseServerClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return createMockClient()
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('GET - Auth header found:', !!token)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required - no token' },
        { status: 401 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    console.log('GET - Auth result:', { user: user?.email || 'no user', error: error?.message || 'no error' })

    if (!user || error) {
      console.error('GET - Authentication failed:', { user, error })
      return NextResponse.json(
        { error: 'Authentication required - invalid token' },
        { status: 401 }
      )
    }

    // Find or create user in Prisma database
    let dbUser = await db.user.findUnique({
      where: { email: user.email! }
    })

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url
        }
      })
    }

    const conversions = await db.promptConversion.findMany({
      where: { user_id: dbUser.id },
      orderBy: { created_at: 'desc' }
    })

    return NextResponse.json(conversions)
  } catch (error) {
    console.error('Error fetching conversions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('POST - Auth header found:', !!token)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required - no token' },
        { status: 401 }
      )
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    )
    
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    console.log('POST - Auth result:', { user: user?.email || 'no user', error: error?.message || 'no error' })

    if (!user || error) {
      console.error('POST - Authentication failed:', { user, error })
      return NextResponse.json(
        { error: 'Authentication required - invalid token' },
        { status: 401 }
      )
    }

    const { original_prompt, json_output, description } = await request.json()

    if (!original_prompt || !json_output) {
      return NextResponse.json(
        { error: 'Original prompt and JSON output are required' },
        { status: 400 }
      )
    }

    // Find or create user in Prisma database
    let dbUser = await db.user.findUnique({
      where: { email: user.email! }
    })

    if (!dbUser) {
      dbUser = await db.user.create({
        data: {
          email: user.email!,
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url
        }
      })
    }

    const savedConversion = await db.promptConversion.create({
      data: {
        original_prompt: original_prompt,
        json_output: json_output,
        description: description || null,
        user_id: dbUser.id,
      }
    })

    return NextResponse.json(savedConversion, { status: 201 })
  } catch (error) {
    console.error('Error saving conversion:', error)
    return NextResponse.json(
      { error: 'Failed to save conversion' },
      { status: 500 }
    )
  }
}
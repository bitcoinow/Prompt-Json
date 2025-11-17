import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { db } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    
    console.log('DELETE - Auth header found:', !!token)
    
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

    if (!user || error) {
      console.error('DELETE - Authentication failed:', { user, error })
      return NextResponse.json(
        { error: 'Authentication required - invalid token' },
        { status: 401 }
      )
    }

    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Conversion ID is required' },
        { status: 400 }
      )
    }

    // Find or create user in Prisma database
    let dbUser = await db.user.findUnique({
      where: { email: user.email! }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if the conversion exists and belongs to the user
    const existingConversion = await db.promptConversion.findFirst({
      where: {
        id: id,
        user_id: dbUser.id
      }
    })

    if (!existingConversion) {
      return NextResponse.json(
        { error: 'Conversion not found' },
        { status: 404 }
      )
    }

    // Delete the conversion
    await db.promptConversion.delete({
      where: { id: id }
    })

    return NextResponse.json(
      { message: 'Conversion deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting conversion:', error)
    return NextResponse.json(
      { error: 'Failed to delete conversion' },
      { status: 500 }
    )
  }
}
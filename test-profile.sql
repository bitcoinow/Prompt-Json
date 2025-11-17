import { createServerComponentClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient(request)
    const { data: { user } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
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

    const { data, error } = await supabase
      .from('prompt_conversions')
      .insert({
        original_prompt: original_prompt,
        json_output: json_output,
        description: description || null,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save conversion' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error saving conversion:', error)
    return NextResponse.json(
      { error: 'Failed to save conversion' },
        { status: 500 }
      )
    }
  }
}
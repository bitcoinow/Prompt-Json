import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({ version: '1.0.0' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get version' },
      { status: 500 }
    )
  }
}
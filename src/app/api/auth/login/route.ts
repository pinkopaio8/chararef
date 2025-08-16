import { NextRequest, NextResponse } from 'next/server'

// In a real application, you should use environment variables for sensitive data
// For demo purposes, we'll use a hardcoded password
// In production, set this in your .env file: MODERATOR_PASSWORD=your_secure_password
const MODERATOR_PASSWORD = process.env.MODERATOR_PASSWORD || 'moderator123'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (password === MODERATOR_PASSWORD) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
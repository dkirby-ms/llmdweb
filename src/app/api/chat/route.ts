import { NextRequest, NextResponse } from 'next/server'

const LLMD_GATEWAY_URL = process.env.LLMD_GATEWAY_URL || 'http://localhost:8000'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, model, messages }: {
      message: string
      model: string
      messages: Message[]
    } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Build the conversation history for the API
    const conversation = [
      ...messages.map((msg: Message) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ]

    // Send request to LLMD gateway
    const response = await fetch(`${LLMD_GATEWAY_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: conversation,
        temperature: 0.7,
        max_tokens: 2000,
        stream: false
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('LLMD Gateway error:', response.status, errorText)
      return NextResponse.json(
        { error: `Gateway error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Extract the response content
    const responseContent = data.choices?.[0]?.message?.content || 'No response received'

    return NextResponse.json({ response: responseContent })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Chat API endpoint is working',
    gateway: LLMD_GATEWAY_URL 
  })
}

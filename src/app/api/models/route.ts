import { NextRequest, NextResponse } from 'next/server'

const LLMD_GATEWAY_URL = process.env.LLMD_GATEWAY_URL || 'http://localhost:8000'

export async function GET() {
  try {
    // Try the standard OpenAI-compatible models endpoint
    const response = await fetch(`${LLMD_GATEWAY_URL}/v1/models`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Models endpoint error:', response.status, await response.text())
      
      // Fallback to a default set of models if the endpoint fails
      return NextResponse.json({
        data: [
          { id: 'claude-3-5-sonnet-20241022', object: 'model' },
          { id: 'gpt-4o', object: 'model' },
          { id: 'gpt-4o-mini', object: 'model' }
        ]
      })
    }

    const data = await response.json()
    
    // Return the models data as-is from the gateway
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching models:', error)
    
    // Fallback to default models on any error
    return NextResponse.json({
      data: [
        { id: 'claude-3-5-sonnet-20241022', object: 'model' },
        { id: 'gpt-4o', object: 'model' },
        { id: 'gpt-4o-mini', object: 'model' }
      ]
    })
  }
}

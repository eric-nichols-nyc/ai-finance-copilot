import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = streamText({
      model: anthropic('claude-3-5-sonnet-20241022'),
      system: `You are a helpful AI financial copilot assistant. You help users understand and manage their finances.

Your capabilities include:
- Answering questions about transactions, budgets, and spending patterns
- Providing financial insights and recommendations
- Helping categorize transactions
- Explaining financial concepts
- Assisting with budget planning

Be concise, friendly, and focused on providing actionable financial advice. If you need specific data about the user's finances to answer their question, politely ask for that information.`,
      messages,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

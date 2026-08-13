import { NextRequest, NextResponse } from 'next/server'

// Resolves a user ID to their DM channel ID, opening the DM if it
// doesn't exist yet. Idempotent — safe to call every time a person
// is selected rather than caching the result.
export async function POST(request: NextRequest) {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SLACK_BOT_TOKEN not configured' }, { status: 500 })
  }
  const { userId } = await request.json()
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }
  const res = await fetch('https://slack.com/api/conversations.open', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({ users: userId }),
  })
  const data = await res.json()
  if (!data.ok) {
    return NextResponse.json({ error: data.error || 'Could not open DM' }, { status: 502 })
  }
  return NextResponse.json({ channelId: data.channel.id })
}

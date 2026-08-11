import { NextRequest, NextResponse } from 'next/server'

interface SlackMessage {
  text: string
  user?: string
  ts: string
}

export async function GET(request: NextRequest) {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SLACK_BOT_TOKEN not configured' }, { status: 500 })
  }
  const channel = request.nextUrl.searchParams.get('channel') || process.env.SLACK_CHANNEL_ID
  if (!channel) {
    return NextResponse.json({ error: 'No channel specified' }, { status: 400 })
  }
  const res = await fetch(
    `https://slack.com/api/conversations.history?channel=${encodeURIComponent(channel)}&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } },
  )
  const data = await res.json()
  if (!data.ok) {
    return NextResponse.json({ error: data.error || 'Slack read failed' }, { status: 502 })
  }
  const messages: SlackMessage[] = (data.messages || []).map(
    (m: { text: string; user?: string; ts: string }) => ({
      text: m.text,
      user: m.user,
      ts: m.ts,
    }),
  )
  return NextResponse.json({ messages })
}

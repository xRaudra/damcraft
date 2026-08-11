import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SLACK_BOT_TOKEN not configured' }, { status: 500 })
  }
  const { text, channel } = await request.json()
  if (!text) return NextResponse.json({ error: 'Missing text' }, { status: 400 })

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      channel: channel || process.env.SLACK_CHANNEL_ID,
      text,
    }),
  })
  const data = await res.json()
  if (!data.ok) {
    return NextResponse.json({ error: data.error || 'Slack send failed' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}

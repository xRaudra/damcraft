import { NextResponse } from 'next/server'

interface SlackChannel {
  id: string
  name: string
  isMember: boolean
}

export async function GET() {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SLACK_BOT_TOKEN not configured' }, { status: 500 })
  }
  const res = await fetch(
    'https://slack.com/api/conversations.list?types=public_channel&exclude_archived=true&limit=200',
    { headers: { Authorization: `Bearer ${token}` } },
  )
  const data = await res.json()
  if (!data.ok) {
    return NextResponse.json({ error: data.error || 'Slack channel list failed' }, { status: 502 })
  }
  const channels: SlackChannel[] = (data.channels || [])
    .map((c: { id: string; name: string; is_member: boolean }) => ({
      id: c.id,
      name: c.name,
      isMember: c.is_member,
    }))
    .sort((a: SlackChannel, b: SlackChannel) => a.name.localeCompare(b.name))
  return NextResponse.json({ channels })
}

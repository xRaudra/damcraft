import { NextResponse } from 'next/server'

interface SlackUser {
  id: string
  name: string
}

export async function GET() {
  const token = process.env.SLACK_BOT_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'SLACK_BOT_TOKEN not configured' }, { status: 500 })
  }
  const res = await fetch('https://slack.com/api/users.list?limit=200', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!data.ok) {
    return NextResponse.json({ error: data.error || 'Slack user list failed' }, { status: 502 })
  }
  interface RawUser {
    id: string
    deleted?: boolean
    is_bot?: boolean
    is_app_user?: boolean
    real_name?: string
    name: string
  }
  const users: SlackUser[] = (data.members || [])
    .filter((u: RawUser) => !u.deleted && !u.is_bot && !u.is_app_user && u.id !== 'USLACKBOT')
    .map((u: RawUser) => ({ id: u.id, name: u.real_name || u.name }))
    .sort((a: SlackUser, b: SlackUser) => a.name.localeCompare(b.name))
  return NextResponse.json({ users })
}

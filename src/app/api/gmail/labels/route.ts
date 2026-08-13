import { NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

export const dynamic = 'force-dynamic'

interface RawLabel {
  id: string
  name: string
  type: string
}

// Only your own custom labels — Gmail's system labels (CATEGORY_*,
// IMPORTANT, CHAT, etc.) have code-like names Gmail's own client
// translates via a hardcoded table we don't have, so surfacing them
// here would just show ugly raw strings for little benefit.
export async function GET() {
  try {
    const accessToken = await getGmailAccessToken()
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/labels', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error('Gmail labels list failed')
    const data = await res.json()
    const labels = ((data.labels || []) as RawLabel[])
      .filter(l => l.type === 'user')
      .map(l => ({ id: l.id, name: l.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
    return NextResponse.json({ labels })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

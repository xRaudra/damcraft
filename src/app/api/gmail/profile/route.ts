import { NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

export const dynamic = 'force-dynamic'

// Your own Google Account profile (email + real photo). This only
// ever works for the authenticated user's own identity — there's no
// equivalent lightweight way to fetch a photo for an arbitrary
// sender, which is why other people still get initial-letter avatars.
export async function GET() {
  try {
    const accessToken = await getGmailAccessToken()
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok) throw new Error('Failed to fetch Google profile')
    const data = await res.json()
    return NextResponse.json({
      email: data.email as string | undefined,
      name: data.name as string | undefined,
      picture: data.picture as string | undefined,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

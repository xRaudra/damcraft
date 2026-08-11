import { NextRequest, NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

interface GmailHeader {
  name: string
  value: string
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getGmailAccessToken()
    const q = request.nextUrl.searchParams.get('q') || 'newer_than:14d'

    const listRes = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15&q=${encodeURIComponent(q)}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    if (!listRes.ok) throw new Error('Gmail list request failed')
    const list = await listRes.json()
    const ids: { id: string }[] = list.messages || []

    const messages = await Promise.all(
      ids.map(async ({ id }) => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        )
        const msg = await msgRes.json()
        const headers: GmailHeader[] = msg.payload?.headers || []
        const get = (n: string) => headers.find(h => h.name === n)?.value || ''
        return {
          id,
          from: get('From'),
          subject: get('Subject'),
          date: get('Date'),
          snippet: msg.snippet as string,
        }
      }),
    )
    return NextResponse.json({ messages })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

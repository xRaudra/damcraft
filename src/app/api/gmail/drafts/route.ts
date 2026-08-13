import { NextResponse } from 'next/server'
import { getGmailAccessToken, getHeader, type GmailHeader } from '@/lib/gmail'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const accessToken = await getGmailAccessToken()
    const listRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/drafts?maxResults=20', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!listRes.ok) throw new Error('Gmail drafts list failed')
    const list = await listRes.json()
    const drafts: { id: string; message: { id: string } }[] = list.drafts || []

    const items = await Promise.all(
      drafts.map(async d => {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${d.message.id}?format=metadata&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${accessToken}` } },
        )
        const msg = await msgRes.json()
        const headers: GmailHeader[] = msg.payload?.headers || []
        return {
          draftId: d.id,
          messageId: d.message.id,
          to: getHeader({ headers }, 'To'),
          subject: getHeader({ headers }, 'Subject'),
          date: getHeader({ headers }, 'Date'),
          snippet: msg.snippet as string,
        }
      }),
    )
    return NextResponse.json({ drafts: items })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

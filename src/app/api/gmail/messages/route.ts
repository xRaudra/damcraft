import { NextRequest, NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

interface GmailHeader {
  name: string
  value: string
}

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getGmailAccessToken()
    const q = request.nextUrl.searchParams.get('q') || ''
    const folder = request.nextUrl.searchParams.get('folder') || 'inbox'
    const customLabel = request.nextUrl.searchParams.get('label') || ''
    const pageToken = request.nextUrl.searchParams.get('pageToken') || ''

    let labelId = 'INBOX'
    if (folder === 'sent') labelId = 'SENT'
    else if (folder === 'starred') labelId = 'STARRED'
    else if (folder === 'label' && customLabel) labelId = customLabel

    const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages')
    listUrl.searchParams.set('maxResults', '30')
    listUrl.searchParams.set('labelIds', labelId)
    if (q) listUrl.searchParams.set('q', q)
    if (pageToken) listUrl.searchParams.set('pageToken', pageToken)

    const listRes = await fetch(listUrl.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
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
        const labelIds: string[] = msg.labelIds || []
        return {
          id,
          threadId: msg.threadId as string,
          from: get('From'),
          subject: get('Subject'),
          date: get('Date'),
          snippet: msg.snippet as string,
          unread: labelIds.includes('UNREAD'),
          starred: labelIds.includes('STARRED'),
          labelIds,
        }
      }),
    )
    return NextResponse.json({ messages, nextPageToken: list.nextPageToken || null })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

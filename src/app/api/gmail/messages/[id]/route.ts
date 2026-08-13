import { NextRequest, NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

interface GmailHeader {
  name: string
  value: string
}
interface GmailPart {
  mimeType?: string
  body?: { data?: string }
  parts?: GmailPart[]
}

function decodeBody(data: string): string {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
}

// Walks the MIME tree for a plain-text part, falling back to HTML
// (tags stripped) if that's all the message provides.
function extractBody(payload: GmailPart): string {
  if (payload.body?.data && payload.mimeType?.startsWith('text/')) {
    const text = decodeBody(payload.body.data)
    return payload.mimeType === 'text/html' ? text.replace(/<[^>]+>/g, ' ') : text
  }
  const parts = payload.parts || []
  const plain = parts.find(p => p.mimeType === 'text/plain')
  if (plain?.body?.data) return decodeBody(plain.body.data)
  const html = parts.find(p => p.mimeType === 'text/html')
  if (html?.body?.data) return decodeBody(html.body.data).replace(/<[^>]+>/g, ' ')
  for (const p of parts) {
    const nested = extractBody(p)
    if (nested) return nested
  }
  return ''
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const accessToken = await getGmailAccessToken()

    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    if (!res.ok) throw new Error('Gmail message fetch failed')
    const msg = await res.json()

    const headers: GmailHeader[] = msg.payload?.headers || []
    const get = (n: string) => headers.find(h => h.name.toLowerCase() === n.toLowerCase())?.value || ''
    const labelIds: string[] = msg.labelIds || []

    const result = {
      id,
      threadId: msg.threadId as string,
      from: get('From'),
      to: get('To'),
      subject: get('Subject'),
      date: get('Date'),
      messageIdHeader: get('Message-ID'),
      references: get('References'),
      body: extractBody(msg.payload || {}).trim(),
      unread: labelIds.includes('UNREAD'),
    }

    // Mark as read — best effort, viewing shouldn't fail if this does.
    if (result.unread) {
      fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ removeLabelIds: ['UNREAD'] }),
      }).catch(() => {})
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

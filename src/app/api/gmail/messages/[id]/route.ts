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
  headers?: GmailHeader[]
}

// Gmail API always base64url-wraps a part's raw bytes for transport,
// regardless of the part's own Content-Transfer-Encoding. If the
// original email itself encoded that part as quoted-printable or
// base64 (very common for HTML/graphic-heavy marketing mail), the raw
// bytes we get back ARE that encoded text — a second decode pass is
// required or it reads as gibberish.
function decodeBase64Url(data: string): string {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf-8')
}

function decodeQuotedPrintable(input: string): string {
  const joined = input.replace(/=\r?\n/g, '') // soft line breaks
  const bytes: number[] = []
  for (let i = 0; i < joined.length; i++) {
    if (joined[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(joined.slice(i + 1, i + 3))) {
      bytes.push(parseInt(joined.slice(i + 1, i + 3), 16))
      i += 2
    } else {
      bytes.push(joined.charCodeAt(i))
    }
  }
  return Buffer.from(bytes).toString('utf-8')
}

function getPartEncoding(part: GmailPart): string {
  return (part.headers?.find(h => h.name.toLowerCase() === 'content-transfer-encoding')?.value || '').toLowerCase()
}

function decodePartText(part: GmailPart): string {
  const raw = decodeBase64Url(part.body?.data || '')
  const enc = getPartEncoding(part)
  if (enc === 'base64') {
    try {
      return Buffer.from(raw, 'base64').toString('utf-8')
    } catch {
      return raw
    }
  }
  if (enc === 'quoted-printable') {
    try {
      return decodeQuotedPrintable(raw)
    } catch {
      return raw
    }
  }
  return raw
}

// Strips style/script blocks entirely (not just their tags — their
// text content is noise too), converts block-level tags to newlines
// for readability, then unescapes the common HTML entities.
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|tr|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

// Walks the MIME tree for a plain-text part, falling back to HTML
// (converted to readable text) if that's all the message provides.
function extractBody(payload: GmailPart): string {
  if (payload.body?.data && payload.mimeType?.startsWith('text/')) {
    const text = decodePartText(payload)
    return payload.mimeType === 'text/html' ? htmlToText(text) : text
  }
  const parts = payload.parts || []
  const plain = parts.find(p => p.mimeType === 'text/plain')
  if (plain?.body?.data) return decodePartText(plain)
  const html = parts.find(p => p.mimeType === 'text/html')
  if (html?.body?.data) return htmlToText(decodePartText(html))
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

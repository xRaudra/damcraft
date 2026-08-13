import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'
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

// Gmail API always base64url-wraps a part's raw bytes for JSON
// transport — that's unrelated to the part's own
// Content-Transfer-Encoding and Content-Type charset. Everything below
// stays in raw Buffers until the final step, where the part's declared
// charset (not a hardcoded UTF-8 guess) does the string conversion —
// guessing UTF-8 on Latin-1/Windows-1252 content is what produces the
// "�" mojibake.
function decodeBase64UrlToBuffer(data: string): Buffer {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

function decodeQuotedPrintableToBuffer(input: Buffer): Buffer {
  const ascii = input.toString('latin1').replace(/=\r?\n/g, '') // soft line breaks
  const bytes: number[] = []
  for (let i = 0; i < ascii.length; i++) {
    if (ascii[i] === '=' && /^[0-9A-Fa-f]{2}$/.test(ascii.slice(i + 1, i + 3))) {
      bytes.push(parseInt(ascii.slice(i + 1, i + 3), 16))
      i += 2
    } else {
      bytes.push(ascii.charCodeAt(i))
    }
  }
  return Buffer.from(bytes)
}

function getHeader(part: GmailPart, name: string): string {
  return part.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

function getPartCharset(part: GmailPart): string {
  const match = /charset\s*=\s*"?([^;"]+)"?/i.exec(getHeader(part, 'Content-Type'))
  return (match?.[1] || 'utf-8').trim()
}

// Resolves a part all the way to a correctly-decoded string: undo the
// transport wrapper, undo the part's own transfer encoding, then
// decode the resulting bytes with its declared charset.
function decodePartText(part: GmailPart): string {
  let bytes = decodeBase64UrlToBuffer(part.body?.data || '')
  const transferEncoding = getHeader(part, 'Content-Transfer-Encoding').toLowerCase()

  if (transferEncoding === 'base64') {
    try {
      bytes = Buffer.from(bytes.toString('latin1'), 'base64')
    } catch {
      // keep bytes as-is
    }
  } else if (transferEncoding === 'quoted-printable') {
    bytes = decodeQuotedPrintableToBuffer(bytes)
  }

  const charset = getPartCharset(part).toLowerCase()
  if (iconv.encodingExists(charset)) {
    return iconv.decode(bytes, charset)
  }
  return bytes.toString('utf-8')
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

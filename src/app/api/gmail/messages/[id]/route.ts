import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'
import { getGmailAccessToken } from '@/lib/gmail'

// This must always reflect live mailbox state (unread flips after a
// read, message content never changes) — never let Vercel/Next cache it.
export const dynamic = 'force-dynamic'

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

// Gmail API's body.data is the part's FINAL, already-decoded content —
// Gmail itself undoes whatever Content-Transfer-Encoding (base64,
// quoted-printable) the original email used server-side. It's only
// base64url-wrapped here for safe JSON transport. Re-decoding based on
// the Content-Transfer-Encoding header (as an earlier version of this
// code did) corrupts already-correct text — that header describes the
// original wire format, not the shape of what the API actually returns.
// The one real remaining step is applying the part's declared charset,
// since a hardcoded UTF-8 assumption mangles Latin-1/Windows-1252 mail.
function decodeBase64UrlToBuffer(data: string): Buffer {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

function getHeader(part: GmailPart, name: string): string {
  return part.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''
}

function getPartCharset(part: GmailPart): string {
  const match = /charset\s*=\s*"?([^;"]+)"?/i.exec(getHeader(part, 'Content-Type'))
  return (match?.[1] || 'utf-8').trim()
}

function decodePartText(part: GmailPart): string {
  const bytes = decodeBase64UrlToBuffer(part.body?.data || '')
  const charset = getPartCharset(part).toLowerCase()
  if (iconv.encodingExists(charset)) {
    return iconv.decode(bytes, charset)
  }
  return bytes.toString('utf-8')
}

// Strips HTML comments (email templates lean on these heavily for
// Outlook/MSO-only fallback markup — <!--[if !mso]><!--> is a comment
// under any standards-compliant parser, not something to render) and
// style/script blocks entirely, converts block-level tags to newlines,
// unescapes common entities, then collapses to at most one blank line
// between paragraphs — table-heavy templates otherwise leave a wall
// of near-empty lines from spacer cells and tracking pixels.
function htmlToText(html: string): string {
  const withTagsStripped = html
    .replace(/<!--[\s\S]*?-->/g, '')
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

  const lines: string[] = []
  for (const rawLine of withTagsStripped.split('\n')) {
    const line = rawLine.replace(/[ \t]+/g, ' ').trim()
    if (line === '' && lines[lines.length - 1] === '') continue
    lines.push(line)
  }
  return lines.join('\n').trim()
}

// Walks the MIME tree and returns the actual part object chosen for
// the body (plain text preferred, HTML as fallback) — split out from
// decoding so the debug endpoint can report exactly what was picked.
function findTextPart(payload: GmailPart): GmailPart | null {
  if (payload.body?.data && payload.mimeType?.startsWith('text/')) return payload
  const parts = payload.parts || []
  const plain = parts.find(p => p.mimeType === 'text/plain' && p.body?.data)
  if (plain) return plain
  const html = parts.find(p => p.mimeType === 'text/html' && p.body?.data)
  if (html) return html
  for (const p of parts) {
    const nested = findTextPart(p)
    if (nested) return nested
  }
  return null
}

function extractBody(payload: GmailPart): string {
  const part = findTextPart(payload)
  if (!part) return ''
  const text = decodePartText(part)
  return part.mimeType === 'text/html' ? htmlToText(text) : text
}

// TEMPORARY diagnostics — remove once the mojibake issue is confirmed
// fixed. Reports the real MIME structure and raw bytes Gmail returned
// so we can see exactly what's happening instead of guessing.
function debugTree(payload: GmailPart, depth = 0): unknown {
  if (depth > 6) return { mimeType: payload.mimeType, truncated: true }
  return {
    mimeType: payload.mimeType,
    hasData: !!payload.body?.data,
    dataLen: payload.body?.data?.length || 0,
    hasAttachmentId: !!(payload.body as { attachmentId?: string } | undefined)?.attachmentId,
    transferEncoding: getHeader(payload, 'Content-Transfer-Encoding'),
    contentType: getHeader(payload, 'Content-Type'),
    children: (payload.parts || []).map(p => debugTree(p, depth + 1)),
  }
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

    const result: Record<string, unknown> = {
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

    if (request.nextUrl.searchParams.get('debug') === '1') {
      const part = findTextPart(msg.payload || {})
      const rawBytes = part ? decodeBase64UrlToBuffer(part.body?.data || '') : Buffer.alloc(0)
      result.debugTree = debugTree(msg.payload || {})
      result.debugChosenMimeType = part?.mimeType || null
      result.debugTransferEncoding = part ? getHeader(part, 'Content-Transfer-Encoding') : ''
      result.debugCharset = part ? getPartCharset(part) : ''
      result.debugRawHexPreview = rawBytes.subarray(0, 150).toString('hex')
      result.debugRawAsciiPreview = rawBytes.subarray(0, 300).toString('latin1')
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

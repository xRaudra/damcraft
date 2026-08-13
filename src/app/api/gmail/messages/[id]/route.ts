import { NextRequest, NextResponse } from 'next/server'
import iconv from 'iconv-lite'
import sanitizeHtml from 'sanitize-html'
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

// Walks the MIME tree for a part matching the given mimeType exactly.
function findPart(payload: GmailPart, mimeType: string): GmailPart | null {
  if (payload.mimeType === mimeType && payload.body?.data) return payload
  for (const p of payload.parts || []) {
    const found = findPart(p, mimeType)
    if (found) return found
  }
  return null
}

// Same shape sanitize-html/Gmail render: kills anything that can
// execute (script, event handlers, forms, iframes, external
// stylesheets, javascript: URIs) while keeping the tags/inline styles
// email templates rely on for their actual visual design. Remote
// images are defanged to data-src (not auto-loaded) — the classic
// email-tracking-pixel privacy pattern every major mail client uses;
// the frontend has a "Show images" toggle that restores them.
function sanitizeEmailHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'html', 'head', 'body', 'title', 'style',
      'div', 'span', 'p', 'br', 'hr', 'a', 'img',
      'b', 'strong', 'i', 'em', 'u', 's', 'small', 'sub', 'sup', 'font', 'center',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'caption',
      'ul', 'ol', 'li', 'dl', 'dt', 'dd',
    ],
    allowedAttributes: {
      '*': ['style', 'class', 'align', 'valign', 'width', 'height', 'bgcolor', 'color', 'border', 'cellpadding', 'cellspacing'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'data-src', 'alt', 'width', 'height'],
      table: ['width', 'height', 'border', 'cellpadding', 'cellspacing', 'bgcolor'],
      td: ['colspan', 'rowspan', 'width', 'height', 'bgcolor', 'align', 'valign'],
      th: ['colspan', 'rowspan', 'width', 'height', 'bgcolor', 'align', 'valign'],
      font: ['face', 'size', 'color'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
      img: (tagName, attribs) => {
        if (attribs.src && !attribs.src.startsWith('data:')) {
          return { tagName: 'img', attribs: { ...attribs, 'data-src': attribs.src, src: '' } }
        }
        return { tagName: 'img', attribs }
      },
    },
    disallowedTagsMode: 'discard',
  })
}

function extractBody(payload: GmailPart): { text: string; html: string | null } {
  const htmlPart = findPart(payload, 'text/html')
  const plainPart = findPart(payload, 'text/plain')

  const html = htmlPart ? sanitizeEmailHtml(decodePartText(htmlPart)) : null
  const text = plainPart
    ? decodePartText(plainPart)
    : htmlPart
      ? htmlToText(decodePartText(htmlPart))
      : ''

  return { text, html }
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

    const { text, html } = extractBody(msg.payload || {})

    const result: Record<string, unknown> = {
      id,
      threadId: msg.threadId as string,
      from: get('From'),
      to: get('To'),
      subject: get('Subject'),
      date: get('Date'),
      messageIdHeader: get('Message-ID'),
      references: get('References'),
      body: text.trim(),
      bodyHtml: html,
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

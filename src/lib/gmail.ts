import iconv from 'iconv-lite'
import sanitizeHtml from 'sanitize-html'

// Exchanges the stored refresh token for a short-lived access token.
// Gmail's API requires OAuth2; there is no long-lived token shortcut.
export async function getGmailAccessToken(): Promise<string> {
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Gmail not connected — missing GMAIL_CLIENT_ID/SECRET/REFRESH_TOKEN')
  }

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error('Failed to refresh Gmail access token')
  const data = await res.json()
  return data.access_token as string
}

export interface GmailHeader {
  name: string
  value: string
}
export interface GmailPart {
  mimeType?: string
  body?: { data?: string }
  parts?: GmailPart[]
  headers?: GmailHeader[]
}

// Gmail API's body.data is the part's FINAL, already-decoded content —
// Gmail itself undoes whatever Content-Transfer-Encoding (base64,
// quoted-printable) the original email used server-side. It's only
// base64url-wrapped here for safe JSON transport. Re-decoding based on
// the Content-Transfer-Encoding header corrupts already-correct text —
// that header describes the original wire format, not the shape of
// what the API actually returns. The one real remaining step is
// applying the part's declared charset, since a hardcoded UTF-8
// assumption mangles Latin-1/Windows-1252 mail.
function decodeBase64UrlToBuffer(data: string): Buffer {
  return Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

export function getHeader(part: GmailPart, name: string): string {
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
export function findPart(payload: GmailPart, mimeType: string): GmailPart | null {
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
// email templates rely on for their actual visual design. Images load
// immediately (no tracking-pixel gate) per explicit request.
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
      img: ['src', 'alt', 'width', 'height'],
      table: ['width', 'height', 'border', 'cellpadding', 'cellspacing', 'bgcolor'],
      td: ['colspan', 'rowspan', 'width', 'height', 'bgcolor', 'align', 'valign'],
      th: ['colspan', 'rowspan', 'width', 'height', 'bgcolor', 'align', 'valign'],
      font: ['face', 'size', 'color'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { target: '_blank', rel: 'noopener noreferrer' }),
    },
    disallowedTagsMode: 'discard',
  })
}

export function extractBody(payload: GmailPart): { text: string; html: string | null } {
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

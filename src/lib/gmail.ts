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
  body?: { data?: string; attachmentId?: string }
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
    // 'cid' (Content-ID references to inline attachments — e.g. a logo
    // embedded in the email itself rather than hotlinked) is allowed
    // through here so resolveCidImages can swap it for real image data
    // afterward; without this sanitize-html strips the src outright
    // since cid isn't a scheme it recognizes.
    allowedSchemesByTag: { img: ['http', 'https', 'data', 'cid'] },
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

function findInlineAttachments(payload: GmailPart): Map<string, { attachmentId: string; mimeType: string }> {
  const found = new Map<string, { attachmentId: string; mimeType: string }>()
  function walk(part: GmailPart) {
    const cid = getHeader(part, 'Content-ID').replace(/^<|>$/g, '')
    if (cid && part.body?.attachmentId) {
      found.set(cid, { attachmentId: part.body.attachmentId, mimeType: part.mimeType || 'image/png' })
    }
    for (const p of part.parts || []) walk(p)
  }
  walk(payload)
  return found
}

// Logos/photos embedded as inline attachments (rather than hotlinked to a
// public URL) show up as <img src="cid:some-content-id">. Gmail's own
// client resolves these internally; anyone else has to fetch the
// attachment bytes separately and inline them as a data: URI. Only runs
// the attachment tree walk/fetches when the html actually references a
// cid, so the common case (hosted images) pays nothing extra.
export async function resolveCidImages(
  html: string,
  payload: GmailPart,
  messageId: string,
  accessToken: string,
): Promise<string> {
  const cids = [...html.matchAll(/src=["']cid:([^"']+)["']/gi)].map(m => m[1])
  if (!cids.length) return html

  const inlineAttachments = findInlineAttachments(payload)
  let result = html
  for (const cid of new Set(cids)) {
    const info = inlineAttachments.get(cid)
    if (!info) continue
    try {
      const res = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${info.attachmentId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      )
      if (!res.ok) continue
      const att = await res.json()
      const base64Std = String(att.data || '').replace(/-/g, '+').replace(/_/g, '/')
      result = result.split(`cid:${cid}`).join(`data:${info.mimeType};base64,${base64Std}`)
    } catch {
      // leave this one as an unresolved cid: reference (same broken-image
      // result as before) rather than failing the whole message load
    }
  }
  return result
}

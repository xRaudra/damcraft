import { NextRequest, NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function POST(request: NextRequest) {
  try {
    const { to, subject, body, bodyHtml, threadId, inReplyTo, references } = await request.json()
    if (!to || !subject || !body) {
      return NextResponse.json({ error: 'Missing to/subject/body' }, { status: 400 })
    }
    const accessToken = await getGmailAccessToken()

    const replyHeaders = inReplyTo
      ? `In-Reply-To: ${inReplyTo}\r\nReferences: ${references || inReplyTo}\r\n`
      : ''

    // The compose box is a contenteditable div (matching Gmail's own compose
    // UI) so drafts with a styled HTML signature keep that styling when sent,
    // instead of flattening to plain text. Mirrors what Gmail itself sends:
    // a multipart/alternative with a plain-text fallback plus the HTML part.
    let raw: string
    if (bodyHtml) {
      const boundary = `----=_Part_${Date.now()}_${Math.random().toString(36).slice(2)}`
      raw = toBase64Url(
        `To: ${to}\r\nSubject: ${subject}\r\n${replyHeaders}MIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary="${boundary}"\r\n\r\n` +
          `--${boundary}\r\nContent-Type: text/plain; charset="UTF-8"\r\n\r\n${body}\r\n\r\n` +
          `--${boundary}\r\nContent-Type: text/html; charset="UTF-8"\r\n\r\n${bodyHtml}\r\n\r\n` +
          `--${boundary}--`,
      )
    } else {
      raw = toBase64Url(
        `To: ${to}\r\nSubject: ${subject}\r\n${replyHeaders}Content-Type: text/plain; charset="UTF-8"\r\n\r\n${body}`,
      )
    }
    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(threadId ? { raw, threadId } : { raw }),
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

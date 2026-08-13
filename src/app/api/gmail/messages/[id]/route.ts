import { NextRequest, NextResponse } from 'next/server'
import { getGmailAccessToken, extractBody, type GmailHeader } from '@/lib/gmail'

// This must always reflect live mailbox state (unread flips after a
// read, message content never changes) — never let Vercel/Next cache it.
export const dynamic = 'force-dynamic'

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

    // Mark as read in the real Gmail account (not just locally).
    // Awaited (not fire-and-forget) so a failure — most likely the
    // token predating the gmail.modify scope — is caught and reported
    // back instead of silently doing nothing.
    if (result.unread) {
      const modifyRes = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ removeLabelIds: ['UNREAD'] }),
        },
      )
      if (modifyRes.ok) {
        result.unread = false
      } else {
        const errBody = await modifyRes.text()
        result.markReadError = `Gmail modify failed (${modifyRes.status}): ${errBody.slice(0, 300)}`
      }
    }

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

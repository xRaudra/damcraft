import { NextResponse } from 'next/server'
import { getGmailAccessToken, extractBody } from '@/lib/gmail'

export const dynamic = 'force-dynamic'

// :id here is the draft ID (not the underlying message ID) — Gmail
// treats drafts as their own resource, separate from messages.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const accessToken = await getGmailAccessToken()

    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/drafts/${id}?format=full`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    )
    if (!res.ok) throw new Error('Gmail draft fetch failed')
    const draft = await res.json()
    const msg = draft.message || {}

    const headers: { name: string; value: string }[] = msg.payload?.headers || []
    const get = (n: string) => headers.find(h => h.name.toLowerCase() === n.toLowerCase())?.value || ''

    const { text, html } = extractBody(msg.payload || {})

    return NextResponse.json({
      draftId: id,
      messageId: msg.id,
      to: get('To'),
      subject: get('Subject'),
      body: text.trim(),
      bodyHtml: html,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// Called after successfully sending an edited draft's content via
// /api/gmail/send, so the now-redundant draft doesn't linger.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const accessToken = await getGmailAccessToken()
    const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/drafts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!res.ok && res.status !== 404) throw new Error('Failed to delete draft')
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

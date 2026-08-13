import { NextRequest, NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

// Generic label add/remove — backs both the star toggle (STARRED)
// and custom label assignment with one endpoint.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const { add, remove } = await request.json()
    const accessToken = await getGmailAccessToken()

    const res = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/modify`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          addLabelIds: Array.isArray(add) ? add : [],
          removeLabelIds: Array.isArray(remove) ? remove : [],
        }),
      },
    )
    if (!res.ok) {
      const text = await res.text()
      throw new Error(text)
    }
    const msg = await res.json()
    return NextResponse.json({ ok: true, labelIds: msg.labelIds || [] })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

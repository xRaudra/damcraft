import { NextResponse } from 'next/server'

// Twilio's own account already retains full WhatsApp message history —
// no local storage needed. "Conversations" here means: distinct numbers
// you've exchanged messages with, derived from recent message history,
// each with its latest message for a preview — same idea as Slack's
// channel list but built from Twilio's Messages resource instead of a
// dedicated conversations API (WhatsApp/Twilio doesn't have one).
export const dynamic = 'force-dynamic'

interface TwilioMessage {
  sid: string
  from: string
  to: string
  body: string
  direction: string
  date_sent: string | null
  date_created: string
}

export async function GET() {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const ownNumber = process.env.TWILIO_WHATSAPP_FROM
  if (!sid || !authToken || !ownNumber) {
    return NextResponse.json({ error: 'Twilio WhatsApp not configured' }, { status: 500 })
  }

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json?PageSize=100`,
    { headers: { Authorization: `Basic ${Buffer.from(`${sid}:${authToken}`).toString('base64')}` } },
  )
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: 502 })
  }
  const data = await res.json()
  const messages: TwilioMessage[] = (data.messages || []).filter(
    (m: TwilioMessage) => m.from?.startsWith('whatsapp:') && m.to?.startsWith('whatsapp:'),
  )

  const latestByContact = new Map<string, TwilioMessage>()
  for (const m of messages) {
    const contact = m.from === ownNumber ? m.to : m.from
    const existing = latestByContact.get(contact)
    const ts = m.date_sent || m.date_created
    const existingTs = existing ? existing.date_sent || existing.date_created : null
    if (!existing || new Date(ts).getTime() > new Date(existingTs as string).getTime()) {
      latestByContact.set(contact, m)
    }
  }

  const conversations = Array.from(latestByContact.entries())
    .map(([number, m]) => ({
      number,
      lastMessage: m.body,
      lastAt: m.date_sent || m.date_created,
      lastDirection: m.direction,
    }))
    .sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime())

  return NextResponse.json({ conversations })
}

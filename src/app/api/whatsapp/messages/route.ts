import { NextRequest, NextResponse } from 'next/server'

// Full thread with one number. Twilio's Messages list filters by a
// single From OR To at a time — a conversation involves our own number
// on one side and the contact on the other, so two queries (contact as
// From, contact as To) cover both directions; merge + dedupe by sid
// since a message could theoretically satisfy both if it were ever
// self-addressed (it can't be here, but dedupe is cheap insurance).
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

export async function GET(request: NextRequest) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!sid || !authToken) {
    return NextResponse.json({ error: 'Twilio WhatsApp not configured' }, { status: 500 })
  }
  const number = request.nextUrl.searchParams.get('number')
  if (!number) return NextResponse.json({ error: 'Missing number' }, { status: 400 })

  const authHeader = `Basic ${Buffer.from(`${sid}:${authToken}`).toString('base64')}`
  const fetchSide = async (param: 'From' | 'To'): Promise<TwilioMessage[]> => {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json?${param}=${encodeURIComponent(number)}&PageSize=100`,
      { headers: { Authorization: authHeader } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.messages || []
  }

  const [fromContact, toContact] = await Promise.all([fetchSide('From'), fetchSide('To')])
  const seen = new Set<string>()
  const merged = [...fromContact, ...toContact].filter(m => {
    if (seen.has(m.sid)) return false
    seen.add(m.sid)
    return true
  })

  const messages = merged
    .map(m => ({
      id: m.sid,
      from: m.from,
      to: m.to,
      body: m.body,
      direction: m.direction,
      at: m.date_sent || m.date_created,
    }))
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())

  return NextResponse.json({ messages })
}

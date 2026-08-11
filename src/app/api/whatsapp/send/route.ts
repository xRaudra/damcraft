import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM
  const defaultTo = process.env.TWILIO_WHATSAPP_TO
  if (!sid || !authToken || !from) {
    return NextResponse.json({ error: 'Twilio WhatsApp not configured' }, { status: 500 })
  }
  const { body, to } = await request.json()
  const recipient = to || defaultTo
  if (!body || !recipient) {
    return NextResponse.json({ error: 'Missing body/to' }, { status: 400 })
  }

  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ From: from, To: recipient, Body: body }),
  })
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}

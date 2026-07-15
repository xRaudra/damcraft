import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_EMAIL
  if (!apiKey || !to) {
    return NextResponse.json({ error: 'Contact form not configured' }, { status: 500 })
  }

  let body: {
    name?: string
    email?: string
    phone?: string
    message?: string
    services?: string[]
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const name = (body.name ?? '').toString().trim().slice(0, 200)
  const email = (body.email ?? '').toString().trim().slice(0, 200)
  const phone = (body.phone ?? '').toString().trim().slice(0, 50)
  const message = (body.message ?? '').toString().trim().slice(0, 5000)
  const services = Array.isArray(body.services)
    ? body.services.map(s => s.toString().slice(0, 100)).slice(0, 10)
    : []

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    services.length ? `Services: ${services.join(', ')}` : null,
    '',
    'Project:',
    message,
  ]
    .filter(Boolean)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Damcraft Website <onboarding@resend.dev>',
      to: [to],
      reply_to: email,
      subject: `New quote request — ${name}`,
      text,
    }),
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}

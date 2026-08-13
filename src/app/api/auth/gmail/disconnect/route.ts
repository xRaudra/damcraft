import { NextResponse } from 'next/server'

// Revokes the grant at Google so the stored refresh token stops
// working immediately. This app has no write access to its own Vercel
// env vars (deliberately — that would need a separate, broader-scoped
// credential), so GMAIL_REFRESH_TOKEN still exists in the project
// afterward, but it's dead. /api/gmail/status correctly reports
// "disconnected" right after this because it does a live token check,
// not just an env-var presence check.
export async function POST() {
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN
  if (!refreshToken) {
    return NextResponse.json({ ok: true, note: 'Already disconnected' })
  }

  const res = await fetch('https://oauth2.googleapis.com/revoke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token: refreshToken }),
  })

  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: text }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}

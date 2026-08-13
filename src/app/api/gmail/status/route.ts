import { NextResponse } from 'next/server'
import { getGmailAccessToken } from '@/lib/gmail'

// Live check rather than "is the env var set" — mints a real access
// token so status flips to disconnected immediately after a revoke,
// even though the (now-dead) refresh token is still sitting in env vars.
export async function GET() {
  try {
    await getGmailAccessToken()
    return NextResponse.json({ connected: true })
  } catch {
    return NextResponse.json({ connected: false })
  }
}

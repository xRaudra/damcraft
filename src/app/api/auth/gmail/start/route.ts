import { NextResponse } from 'next/server'

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
].join(' ')

export async function GET() {
  const clientId = process.env.GMAIL_CLIENT_ID
  const redirectUri = process.env.GMAIL_REDIRECT_URI
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'GMAIL_CLIENT_ID / GMAIL_REDIRECT_URI not configured' },
      { status: 500 },
    )
  }
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', SCOPES)
  url.searchParams.set('access_type', 'offline')
  url.searchParams.set('prompt', 'consent')
  return NextResponse.redirect(url.toString())
}

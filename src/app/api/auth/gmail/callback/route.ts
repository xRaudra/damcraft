import { NextRequest, NextResponse } from 'next/server'

function htmlPage(body: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><body style="font-family:sans-serif;max-width:640px;margin:60px auto;line-height:1.6">${body}</body></html>`,
    { status, headers: { 'Content-Type': 'text/html' } },
  )
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const error = request.nextUrl.searchParams.get('error')
  const clientId = process.env.GMAIL_CLIENT_ID
  const clientSecret = process.env.GMAIL_CLIENT_SECRET
  const redirectUri = process.env.GMAIL_REDIRECT_URI

  if (error) {
    return htmlPage(`<p>Gmail authorization failed: ${error}</p>`, 400)
  }
  if (!code || !clientId || !clientSecret || !redirectUri) {
    return htmlPage('<p>Missing authorization code or Gmail OAuth environment variables.</p>', 400)
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    return htmlPage(`<p>Token exchange failed:</p><pre>${text}</pre>`, 500)
  }

  const data = await tokenRes.json()
  const refreshToken = data.refresh_token as string | undefined

  if (!refreshToken) {
    return htmlPage(
      '<h2>No refresh token returned</h2><p>Google only issues a refresh token on the first consent for an app. Revoke access at ' +
        '<a href="https://myaccount.google.com/permissions" target="_blank">myaccount.google.com/permissions</a> and try connecting again.</p>',
    )
  }

  return htmlPage(`
    <h2>Gmail connected ✓</h2>
    <p>Copy this value into your Vercel project as the environment variable <code>GMAIL_REFRESH_TOKEN</code>, then redeploy. This is shown once — treat it like a password.</p>
    <pre style="background:#111;color:#0f0;padding:16px;border-radius:8px;word-break:break-all">${refreshToken}</pre>
  `)
}

import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.PERSONAL_APP_PASSWORD ?? 'xRaudra@1916'

export function proxy(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Basic ')) {
    const decoded = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8')
    const password = decoded.split(':').slice(1).join(':')
    if (password === PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Access Denied', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Personal Access"',
    },
  })
}

export const config = {
  matcher: [
    '/personalapp',
    '/personalapp/:path*',
    '/api/gmail/:path*',
    '/api/auth/gmail/start',
    '/api/auth/gmail/disconnect',
    '/api/slack/:path*',
    '/api/whatsapp/send',
    '/api/whatsapp/conversations',
    '/api/whatsapp/messages',
    // NOT protected: /api/auth/gmail/callback (guarded by Google's
    // single-use OAuth code) and /api/whatsapp/incoming (Twilio
    // webhook, guarded by request-signature validation instead —
    // Twilio can't send this app's Basic Auth credentials).
  ],
}

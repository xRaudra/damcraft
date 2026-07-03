import { NextRequest, NextResponse } from 'next/server'

const PASSWORD = process.env.PERSONAL_APP_PASSWORD ?? 'dam-private-2024'

export function middleware(request: NextRequest) {
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
  matcher: ['/personalapp', '/personalapp/:path*'],
}

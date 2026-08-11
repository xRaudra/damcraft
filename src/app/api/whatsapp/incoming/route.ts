import { NextRequest, NextResponse } from 'next/server'
import { isValidTwilioRequest } from '@/lib/twilio'

// Twilio calls this webhook server-to-server when a WhatsApp message
// arrives — it can't present the app's Basic Auth login, so this route
// is intentionally excluded from proxy.ts and instead validates
// Twilio's request signature.
export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const params: Record<string, string> = {}
  formData.forEach((value, key) => {
    params[key] = value.toString()
  })

  const signature = request.headers.get('x-twilio-signature')
  const url = `${request.nextUrl.origin}/api/whatsapp/incoming`
  if (!isValidTwilioRequest(url, params, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 })
  }

  // Empty TwiML response = receive silently, no auto-reply.
  return new NextResponse('<Response></Response>', {
    status: 200,
    headers: { 'Content-Type': 'text/xml' },
  })
}

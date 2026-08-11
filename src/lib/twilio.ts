import crypto from 'crypto'

// Validates Twilio's X-Twilio-Signature header (documented HMAC-SHA1
// scheme) so the incoming-message webhook can trust the request is
// really from Twilio without an interactive login — Twilio can't send
// the app's Basic Auth credentials.
export function isValidTwilioRequest(
  url: string,
  params: Record<string, string>,
  signature: string | null,
): boolean {
  const authToken = process.env.TWILIO_AUTH_TOKEN
  if (!authToken || !signature) return false
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, key) => acc + key + params[key], url)
  const expected = crypto.createHmac('sha1', authToken).update(sorted).digest('base64')
  return expected === signature
}

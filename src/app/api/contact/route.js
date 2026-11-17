export const dynamic = 'force-dynamic';

const contactEmail = 'hello@damcraft.com';

export function GET() {
  return Response.json({ available: Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_EMAIL), email: contactEmail }, { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request) {
  let body;
  try {
    if (Number(request.headers.get('content-length') || 0) > 20000) {
      return Response.json({ error: 'Your message is too long.' }, { status: 413 });
    }
    body = await request.json();
  } catch {
    return Response.json({ error: 'Please check your message and try again.' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ error: 'Invalid request.' }, { status: 400 });
  if (body._hp_website) return Response.json({ ok: true });

  const clean = (value, length) => typeof value === 'string' ? value.trim().slice(0, length) : '';
  const name = clean(body.name, 200).replace(/[\r\n]/g, ' ');
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 50);
  const message = clean(body.message, 5000);
  const services = Array.isArray(body.services) ? body.services.filter(s => typeof s === 'string').slice(0, 10).map(s => s.slice(0, 100)) : [];
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: 'Please enter your name, a valid email, and a project description.' }, { status: 400 });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) return Response.json({ error: 'Please email us directly.', email: contactEmail }, { status: 503 });
  const text = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : '', services.length ? `Services: ${services.join(', ')}` : '', '', 'Project:', message].join('\n');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: process.env.CONTACT_FROM || 'Damcraft Website <onboarding@resend.dev>', to: [to], reply_to: email, subject: `New project inquiry — ${name}`, text }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) return Response.json({ error: 'We couldn’t send your message. Please email us directly.', email: contactEmail }, { status: 502 });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'We couldn’t send your message. Please email us directly.', email: contactEmail }, { status: 502 });
  }
}

import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, phone, projectType, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "Damcraft Contact <hello@damcraft.com>",
    to: process.env.CONTACT_EMAIL!,
    replyTo: email,
    subject: `New enquiry — ${projectType || "General"} from ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1A0E08;">
        <div style="background:#FF5300;padding:32px 40px;border-radius:12px 12px 0 0;">
          <p style="margin:0;color:#FAFAF8;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;font-weight:600;">New Project Enquiry</p>
        </div>
        <div style="background:#FAFAF8;padding:40px;border-radius:0 0 12px 12px;border:1px solid #eee;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:13px;color:#4A3530;width:120px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:15px;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:13px;color:#4A3530;">Email</td><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:15px;"><a href="mailto:${email}" style="color:#FF5300;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:13px;color:#4A3530;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:15px;">${phone}</td></tr>` : ""}
            <tr><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:13px;color:#4A3530;">Project Type</td><td style="padding:10px 0;border-bottom:1px solid #f0ece8;font-size:15px;">${projectType || "Not specified"}</td></tr>
          </table>
          <div style="margin-top:28px;">
            <p style="font-size:13px;color:#4A3530;margin-bottom:10px;text-transform:uppercase;letter-spacing:0.08em;font-weight:600;">Message</p>
            <p style="font-size:15px;line-height:1.7;color:#1A0E08;margin:0;">${message.replace(/\n/g, "<br/>")}</p>
          </div>
          <div style="margin-top:40px;padding-top:24px;border-top:1px solid #f0ece8;">
            <p style="font-size:12px;color:#4A3530;opacity:0.5;margin:0;">Damcraft · hello@damcraft.com · damcraft.com</p>
          </div>
        </div>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}

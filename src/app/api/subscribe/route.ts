import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  let body: { email?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }

  const { email } = body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return NextResponse.json({ error: 'Not configured' }, { status: 500 });

  try {
    await resend.contacts.create({ email, audienceId, unsubscribed: false });

    // Welcome email
    await resend.emails.send({
      from: 'InfoDaily <hello@infodaily.net>',
      to: email,
      subject: 'Welcome to InfoDaily! 🎉',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px">
          <h1 style="color:#1d4ed8;font-size:28px;margin-bottom:8px">Welcome to InfoDaily!</h1>
          <p style="color:#374151;font-size:16px;line-height:1.6">You're now subscribed to our daily newsletter. Every day you'll receive the <strong>Article of the Day</strong> — expert-written content on health, finance, technology, and more.</p>
          <a href="https://www.infodaily.net" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Visit InfoDaily →</a>
          <p style="color:#9ca3af;font-size:12px;margin-top:32px">You can unsubscribe at any time.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

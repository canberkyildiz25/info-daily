import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, CATEGORIES } from '@/lib/posts';
import { getCoverImageUrl } from '@/lib/pexels';

export const maxDuration = 60;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) return NextResponse.json({ error: 'RESEND_AUDIENCE_ID not set' }, { status: 500 });

  const posts = getAllPosts();
  const todayPost = posts[0];
  if (!todayPost) return NextResponse.json({ error: 'No posts found' }, { status: 404 });

  const cat = CATEGORIES.find(c => c.slug === todayPost.category);
  const coverImage = await getCoverImageUrl(`${todayPost.title} ${todayPost.category}`, todayPost.slug) || todayPost.coverImage;
  const articleUrl = `https://www.infodaily.net/${todayPost.category}/${todayPost.slug}`;

  try {
    const { data: contactsData } = await resend.contacts.list({ audienceId });
    const subscribers = (contactsData?.data ?? []).filter((c: { unsubscribed: boolean }) => !c.unsubscribed);

    if (subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers yet', sent: 0 });
    }

    const emails = subscribers.map((c: { email: string }) => c.email);

    await resend.emails.send({
      from: 'InfoDaily <hello@infodaily.net>',
      to: emails,
      subject: `📰 Article of the Day: ${todayPost.title}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#ffffff">
          <!-- Header -->
          <div style="background:#2563eb;padding:24px 32px;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;font-size:22px;margin:0;font-weight:800">InfoDaily</h1>
            <p style="color:#bfdbfe;font-size:13px;margin:4px 0 0">Knowledge for Every Day</p>
          </div>

          <!-- Label -->
          <div style="padding:24px 32px 0">
            <span style="background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:0.05em;text-transform:uppercase">✦ Article of the Day</span>
          </div>

          <!-- Cover image -->
          ${coverImage ? `<div style="padding:16px 32px 0"><img src="${coverImage}" alt="${todayPost.title}" style="width:100%;border-radius:10px;display:block" /></div>` : ''}

          <!-- Content -->
          <div style="padding:24px 32px">
            <p style="color:#6b7280;font-size:12px;margin:0 0 8px">${cat?.icon ?? ''} ${cat?.label ?? ''} · ${todayPost.readingTime}</p>
            <h2 style="color:#111827;font-size:24px;font-weight:800;margin:0 0 12px;line-height:1.3">${todayPost.title}</h2>
            <p style="color:#4b5563;font-size:15px;line-height:1.7;margin:0 0 24px">${todayPost.excerpt}</p>
            <a href="${articleUrl}" style="display:inline-block;padding:14px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">Read Full Article →</a>
          </div>

          <!-- Footer -->
          <div style="padding:24px 32px;border-top:1px solid #f3f4f6;margin-top:16px">
            <p style="color:#9ca3af;font-size:12px;margin:0">You're receiving this because you subscribed to InfoDaily.<br/>
            <a href="https://www.infodaily.net" style="color:#6b7280">Visit site</a></p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, sent: emails.length, article: todayPost.title });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = 'push:subscriptions';

export async function POST(req: NextRequest) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json() as { title?: string; excerpt?: string; url?: string; category?: string };
  const payload = JSON.stringify({
    title: body.title ?? 'New article on InfoDaily',
    body: body.excerpt ?? 'A new article is waiting for you!',
    url: body.url ?? 'https://www.infodaily.net',
  });

  const allSubs = await redis.hgetall(KEY) as Record<string, string> | null;
  if (!allSubs) return NextResponse.json({ sent: 0 });

  const results = await Promise.allSettled(
    Object.entries(allSubs).map(async ([endpoint, raw]) => {
      const sub = JSON.parse(raw) as PushSubscriptionJSON;
      await webpush.sendNotification(sub as Parameters<typeof webpush.sendNotification>[0], payload);
      return endpoint;
    })
  );

  // Remove expired/invalid subscriptions (410 Gone)
  const toRemove = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map(r => (r.reason as { statusCode?: number; endpoint?: string })?.endpoint)
    .filter(Boolean) as string[];

  if (toRemove.length > 0) {
    await redis.hdel(KEY, ...toRemove);
  }

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return NextResponse.json({ sent, failed: results.length - sent });
}

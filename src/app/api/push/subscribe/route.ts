import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY = 'push:subscriptions';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { subscription?: PushSubscriptionJSON };
    const { subscription } = body;
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }
    // Store by endpoint to avoid duplicates
    await redis.hset(KEY, { [subscription.endpoint]: JSON.stringify(subscription) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json() as { endpoint?: string };
    if (!body.endpoint) return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    await redis.hdel(KEY, body.endpoint);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 });
  }
}

import { getAllPosts } from '@/lib/posts';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  const posts = getAllPosts().map(p => ({
    title: p.title,
    excerpt: p.excerpt,
    slug: p.slug,
    category: p.category,
    tags: p.tags,
    readingTime: p.readingTime,
  }));
  return NextResponse.json(posts);
}

import { NextResponse } from 'next/server';

export const revalidate = 1800; // 30 min

export async function GET() {
  const key = process.env.NEWS_API_KEY;
  if (!key) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=gaming+video+games+esports&language=en&sortBy=publishedAt&pageSize=12&apiKey=${key}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return NextResponse.json([]);
    const data = await res.json();
    const articles = (data.articles ?? []).filter(
      (a: { title?: string; urlToImage?: string }) => a.title && a.title !== '[Removed]' && a.urlToImage
    );
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([]);
  }
}

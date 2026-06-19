export interface NewsArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsResponse {
  status: string;
  totalResults: number;
  articles: NewsArticle[];
}

const BASE = 'https://newsapi.org/v2';
const KEY = process.env.NEWS_API_KEY!;

// Map our site categories to NewsAPI topics
const CATEGORY_QUERIES: Record<string, string> = {
  health:        'health medicine wellness',
  finance:       'finance economy stocks investment',
  technology:    'technology AI software gadgets',
  'life-hacks':  'productivity lifestyle self-improvement',
  travel:        'travel tourism destinations',
  food:          'food cooking nutrition recipes',
  business:      'business startup entrepreneurship',
  science:       'science research discovery space',
  relationships: 'relationships psychology mental health',
  entertainment: 'entertainment movies music celebrity',
};

export async function getTopHeadlines(pageSize = 10): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${BASE}/top-headlines?language=en&pageSize=${pageSize}&apiKey=${KEY}`,
      { next: { revalidate: 900 } } // 15 min cache
    );
    if (!res.ok) return [];
    const data: NewsResponse = await res.json();
    return data.articles.filter(a => a.title && a.title !== '[Removed]');
  } catch {
    return [];
  }
}

export async function getNewsByCategory(category: string, pageSize = 6): Promise<NewsArticle[]> {
  const q = CATEGORY_QUERIES[category] ?? category;
  try {
    const res = await fetch(
      `${BASE}/everything?q=${encodeURIComponent(q)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${KEY}`,
      { next: { revalidate: 1800 } } // 30 min cache
    );
    if (!res.ok) return [];
    const data: NewsResponse = await res.json();
    return data.articles.filter(a => a.title && a.title !== '[Removed]' && a.urlToImage);
  } catch {
    return [];
  }
}

export async function getBreakingNews(pageSize = 5): Promise<NewsArticle[]> {
  try {
    const res = await fetch(
      `${BASE}/top-headlines?language=en&category=general&pageSize=${pageSize}&apiKey=${KEY}`,
      { next: { revalidate: 300 } } // 5 min cache — more frequent for breaking
    );
    if (!res.ok) return [];
    const data: NewsResponse = await res.json();
    return data.articles.filter(a => a.title && a.title !== '[Removed]');
  } catch {
    return [];
  }
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

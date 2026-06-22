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
const GUARDIAN_KEY = process.env.GUARDIAN_API_KEY;

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

// ── The Guardian ─────────────────────────────────────────────────────────────

interface GuardianResult {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName: string;
  fields?: { trailText?: string; thumbnail?: string; byline?: string };
}

function guardianToNewsArticle(r: GuardianResult): NewsArticle {
  return {
    source: { id: 'the-guardian', name: 'The Guardian' },
    author: r.fields?.byline ?? null,
    title: r.webTitle,
    description: r.fields?.trailText ?? null,
    url: r.webUrl,
    urlToImage: r.fields?.thumbnail ?? null,
    publishedAt: r.webPublicationDate,
    content: null,
  };
}

export async function getGuardianHeadlines(pageSize = 8): Promise<NewsArticle[]> {
  if (!GUARDIAN_KEY) return [];
  try {
    const res = await fetch(
      `https://content.guardianapis.com/search?api-key=${GUARDIAN_KEY}&show-fields=trailText,thumbnail,byline&order-by=newest&page-size=${pageSize}`,
      { next: { revalidate: 900 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as { response: { results: GuardianResult[] } };
    return (data.response?.results ?? [])
      .filter(r => r.webTitle)
      .map(guardianToNewsArticle);
  } catch {
    return [];
  }
}

export async function getGuardianBySection(section: string, pageSize = 6): Promise<NewsArticle[]> {
  if (!GUARDIAN_KEY) return [];
  try {
    const res = await fetch(
      `https://content.guardianapis.com/search?api-key=${GUARDIAN_KEY}&section=${section}&show-fields=trailText,thumbnail,byline&order-by=newest&page-size=${pageSize}`,
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return [];
    const data = await res.json() as { response: { results: GuardianResult[] } };
    return (data.response?.results ?? [])
      .filter(r => r.webTitle)
      .map(guardianToNewsArticle);
  } catch {
    return [];
  }
}

// ── HackerNews ────────────────────────────────────────────────────────────────

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
}

function hnToNewsArticle(item: HNItem): NewsArticle {
  return {
    source: { id: 'hacker-news', name: 'Hacker News' },
    author: item.by,
    title: item.title,
    description: `${item.score} points · ${item.descendants ?? 0} comments`,
    url: item.url ?? `https://news.ycombinator.com/item?id=${item.id}`,
    urlToImage: null,
    publishedAt: new Date(item.time * 1000).toISOString(),
    content: null,
  };
}

export async function getHackerNewsTop(count = 8): Promise<NewsArticle[]> {
  try {
    const idsRes = await fetch(
      'https://hacker-news.firebaseio.com/v0/topstories.json',
      { next: { revalidate: 600 } }
    );
    if (!idsRes.ok) return [];
    const ids: number[] = await idsRes.json();

    const stories = await Promise.all(
      ids.slice(0, count * 2).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`, { next: { revalidate: 600 } })
          .then(r => r.json() as Promise<HNItem>)
          .catch(() => null)
      )
    );

    return stories
      .filter((s): s is HNItem => s !== null && Boolean(s.title) && Boolean(s.url))
      .slice(0, count)
      .map(hnToNewsArticle);
  } catch {
    return [];
  }
}

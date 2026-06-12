const FEEDS: Record<string, string[]> = {
  health: [
    'https://rss.medicalnewstoday.com/medicalnewstoday.xml',
    'http://rss.cnn.com/rss/cnn_health.rss',
    'https://www.healthline.com/rss/health-news',
  ],
  finance: [
    'https://finance.yahoo.com/news/rssindex',
    'https://www.cnbc.com/id/10000664/device/rss/rss.html',
    'https://feeds.marketwatch.com/marketwatch/topstories/',
  ],
  technology: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
    'https://feeds.arstechnica.com/arstechnica/index',
  ],
  'life-hacks': [
    'https://lifehacker.com/rss',
    'https://www.fastcompany.com/latest/rss',
  ],
  travel: [
    'https://www.lonelyplanet.com/news/feed',
    'https://www.travelandleisure.com/feeds/all',
  ],
  food: [
    'https://www.seriouseats.com/feeds/all',
    'https://www.bonappetit.com/feed/rss',
  ],
  business: [
    'https://feeds.hbr.org/harvardbusiness',
    'https://www.entrepreneur.com/latest.rss',
  ],
  science: [
    'https://www.sciencedaily.com/rss/top/science.xml',
    'https://feeds.newscientist.com/science-news',
  ],
  relationships: [
    'https://www.psychologytoday.com/us/rss/all',
  ],
  entertainment: [
    'https://www.rollingstone.com/feed/',
    'https://variety.com/feed/',
  ],
};

function parseTitles(xml: string): string[] {
  const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
  return items
    .map(item => {
      const match = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
      return match?.[1]?.trim().replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"') ?? '';
    })
    .filter(t => t.length > 20 && t.length < 200);
}

export async function fetchTrendingTopics(category: string, limit = 8): Promise<string[]> {
  const feeds = FEEDS[category] ?? [];
  const titles: string[] = [];

  for (const url of feeds) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(6000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InfoDaily RSS Reader)' },
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const xml = await res.text();
      titles.push(...parseTitles(xml));
      if (titles.length >= limit) break;
    } catch {
      continue;
    }
  }

  return [...new Set(titles)].slice(0, limit);
}

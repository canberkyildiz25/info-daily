/* Kaynaklar 2026-08-28'de tek tek yoklandı: erişilebilirlik, öğe sayısı ve
   son yayın tarihi. Sekiz besleme elendi.

   En sinsi olanı CNN Health'ti: 200 dönüyor ve 29 öğe veriyordu, ama en yeni
   yazısı 1382 günlüktü — yani sağlık kategorisi neredeyse dört yıllık haberi
   taze diye gösteriyordu. Sadece HTTP durumuna bakan bir kontrol bunu asla
   yakalayamaz; tazelik de ölçülmeli.

   Diğerleri açıkça düşüyordu: medicalnewstoday ve HBR bağlantı hatası,
   newscientist 500, travelandleisure ve seriouseats 402
   (ödeme duvarı), lonelyplanet 0 öğe. Travel ve relationships kategorileri
   bu yüzden tamamen habersiz kalmıştı.

   Gaming kategorisi CATEGORIES içinde vardı ama burada karşılığı yoktu, yani
   hiç haber çekmiyordu.

   psychologytoday testte 502 döndü ama listede kaldı: 502 geçici bir sunucu
   hatası olabilir ve kategoriyi artık ScienceDaily taşıyor — geri gelirse
   kazanç, gelmezse kayıp yok. Kalıcı ölmüş olanlar çıkarıldı. */
const FEEDS: Record<string, string[]> = {
  health: [
    'https://www.healthline.com/rss/health-news',
    'https://www.npr.org/rss/rss.php?id=1128',
    'https://www.sciencedaily.com/rss/health_medicine.xml',
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
  /* lifehacker 2.06 MB donuyordu — Next'in 2 MB veri onbellegi tavanini az
     farkla asiyor, yani her istekte yeniden indiriliyordu (build bunu uyari
     olarak basiyor). Besleme 100 oge tasiyor; sayfa ise en yeni 12 tanesini
     kullaniyor. Yerine gelen iki kaynak toplam 38 KB ve ayni tazelikte. */
  'life-hacks': [
    'https://www.makeuseof.com/feed/',
    'https://zapier.com/blog/feeds/latest/',
    'https://www.fastcompany.com/latest/rss',
  ],
  travel: [
    'https://www.cntraveler.com/feed/rss',
    'https://thepointsguy.com/feed/',
    'https://skift.com/feed/',
  ],
  food: [
    'https://www.bonappetit.com/feed/rss',
    'https://www.thekitchn.com/main.rss',
    'https://www.epicurious.com/feed/rss',
  ],
  business: [
    'https://www.entrepreneur.com/latest.rss',
    'https://www.businessinsider.com/rss',
    'https://www.inc.com/rss',
  ],
  science: [
    'https://www.sciencedaily.com/rss/top/science.xml',
    'https://phys.org/rss-feed/',
    'https://www.livescience.com/feeds/all',
  ],
  relationships: [
    'https://www.sciencedaily.com/rss/mind_brain/relationships.xml',
    'https://www.psychologytoday.com/us/rss/all',
  ],
  entertainment: [
    'https://www.rollingstone.com/feed/',
    'https://variety.com/feed/',
  ],
  gaming: [
    'https://www.polygon.com/rss/index.xml',
    'https://www.eurogamer.net/feed',
    'https://www.rockpapershotgun.com/feed',
  ],
};

export interface RssArticle {
  source: { id: null; name: string };
  author: null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: null;
}

function decodeXml(value: string): string {
  return value
    .replace(/^<!\[CDATA\[|\]\]>$/g, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function tagValue(item: string, tag: string): string | null {
  const match = item.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return match ? decodeXml(match[1]) : null;
}

function parseArticles(xml: string, sourceName: string): RssArticle[] {
  const items = xml.match(/<item\b[\s\S]*?<\/item>|<entry\b[\s\S]*?<\/entry>/gi) ?? [];
  return items.flatMap(item => {
    const title = tagValue(item, 'title');
    const rssLink = tagValue(item, 'link');
    const atomLink = item.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/i)?.[1] ?? null;
    const url = atomLink ?? rssLink;
    if (!title || !url || title.length < 20 || title.length > 220) return [];
    const description = tagValue(item, 'description') ?? tagValue(item, 'summary') ?? tagValue(item, 'content:encoded');
    const dateValue = tagValue(item, 'pubDate') ?? tagValue(item, 'published') ?? tagValue(item, 'updated');
    const parsedDate = dateValue ? new Date(dateValue) : null;
    const publishedAt = parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate.toISOString() : new Date(0).toISOString();
    const image = item.match(/<(?:media:content|media:thumbnail)\b[^>]*\burl=["']([^"']+)["']/i)?.[1]
      ?? item.match(/<enclosure\b[^>]*\burl=["']([^"']+)["'][^>]*\btype=["']image\//i)?.[1]
      ?? null;
    return [{ source: { id: null, name: sourceName }, author: null, title, description: description?.slice(0, 420) || null, url, urlToImage: image, publishedAt, content: null }];
  });
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
      titles.push(...parseArticles(xml, 'RSS').map(article => article.title));
      if (titles.length >= limit) break;
    } catch {
      continue;
    }
  }

  return [...new Set(titles)].slice(0, limit);
}

/** Primary live news comes from NewsAPI; this keeps the homepage current if that service is unavailable. */
export async function fetchLatestRssNews(limit = 12, onlyCategory?: string): Promise<RssArticle[]> {
  const sources = Object.entries(FEEDS)
    .filter(([category]) => !onlyCategory || category === onlyCategory)
    .flatMap(([category, urls]) => urls.map(url => ({ category, url })));
  const results = await Promise.allSettled(sources.map(async ({ category, url }) => {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(8000),
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; InfoDaily RSS Reader)' },
      next: { revalidate: 900 },
    });
    if (!res.ok) return [];
    return parseArticles(await res.text(), category.replace('-', ' '));
  }));
  const unique = new Map<string, RssArticle>();
  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const article of result.value) if (!unique.has(article.url)) unique.set(article.url, article);
  }
  return [...unique.values()]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

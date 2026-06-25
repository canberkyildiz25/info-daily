export interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
  channelName: string;
  channelId: string;
  thumbnail: string;
  category: string;
}

// Curated educational/news YouTube channels, one per major category
const CHANNELS: { id: string; name: string; category: string }[] = [
  // General
  { id: 'UCAuUUnT6oDeKwE6v1NGQxug', name: 'TED',            category: 'general' },
  { id: 'UCLXo7UDZvByw2ixzpQCufnA', name: 'Vox',            category: 'general' },
  // Technology
  { id: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship',        category: 'technology' },
  { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'MKBHD',          category: 'technology' },
  { id: 'UCXuqSBlHAE6Xw-yeJA0Tunw', name: 'Linus Tech Tips', category: 'technology' },
  // Science
  { id: 'UCHnyfMqiRRG1u-2MsSQLbXA', name: 'Veritasium',     category: 'science' },
  { id: 'UCsXVk37bltHxD1rDPwtNM8Q', name: 'Kurzgesagt',     category: 'science' },
  // Health
  { id: 'UC0QHWhjbe5fGJEPz3sZqH6A', name: 'Doctor Mike',    category: 'health' },
  // Finance
  { id: 'UCV6KDgJskWaEckne5aPA0aQ', name: 'Graham Stephan', category: 'finance' },
  // Food
  { id: 'UCPD_bxCRGpmmeQcbe2kpPaA', name: 'Joshua Weissman', category: 'food' },
  // Travel
  { id: 'UCBcRF18a7Qf58cCRy5xuWwQ', name: 'Mark Wiens',     category: 'travel' },
];

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

function parseChannelRSS(
  xml: string,
  channelName: string,
  channelId: string,
  category: string,
  max = 5
): VideoItem[] {
  const entries = xml.split('<entry>').slice(1, max + 1);
  return entries
    .map(entry => {
      const videoId   = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? '';
      const rawTitle  = entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? '';
      const published = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? '';
      if (!videoId) return null;
      return {
        id: videoId,
        title: decodeEntities(rawTitle),
        publishedAt: published,
        channelName,
        channelId,
        thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        category,
      } satisfies VideoItem;
    })
    .filter((v): v is VideoItem => v !== null);
}

export async function getVideos(category?: string): Promise<VideoItem[]> {
  const channels =
    category && category !== 'all'
      ? CHANNELS.filter(c => c.category === category)
      : CHANNELS;

  const results = await Promise.allSettled(
    channels.map(async ch => {
      const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`,
        { next: { revalidate: 3600 } } // 1-hour cache
      );
      if (!res.ok) return [] as VideoItem[];
      const xml = await res.text();
      return parseChannelRSS(xml, ch.name, ch.id, ch.category);
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<VideoItem[]> => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export const VIDEO_CATEGORIES = [
  { id: 'all',        label: 'All' },
  { id: 'general',    label: 'General' },
  { id: 'technology', label: 'Technology' },
  { id: 'science',    label: 'Science' },
  { id: 'health',     label: 'Health' },
  { id: 'finance',    label: 'Finance' },
  { id: 'food',       label: 'Food' },
  { id: 'travel',     label: 'Travel' },
];

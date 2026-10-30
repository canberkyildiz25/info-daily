export interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
  channelName: string;
  channelId: string;
  thumbnail: string;
  category: string;
}

/* Yalnızca sitenin konusu: teknoloji ve oyun. Burada yemek, finans, seyahat
   ve sağlık kanalları da vardı; bir teknoloji rehberinde acı kanat programı
   ve faiz yorumu çıkıyordu. */
const CHANNELS: { id: string; name: string; category: string }[] = [
  // Technology
  { id: 'UCsBjURrPoezykLs9EqgamOA', name: 'Fireship',        category: 'technology' },
  { id: 'UCBJycsmduvYEL83R_U4JriQ', name: 'MKBHD',          category: 'technology' },
  { id: 'UCXuqSBlHAE6Xw-yeJA0Tunw', name: 'Linus Tech Tips', category: 'technology' },
  // Gaming
  { id: 'UC9PBzalIcEQCsiIkq36PyUA', name: 'Digital Foundry', category: 'gaming' },
  { id: 'UChIs72whgZI9w6d6FhwGGHA', name: 'Gamers Nexus',    category: 'gaming' },
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
  /* Shorts ayıklanıyor: dikey videolar 16:9 karelerde iki yanı bulanık
     bantlarla, oynatıcıda da dar bir şerit olarak çıkıyordu. Akış onları
     /shorts/ adresiyle işaretliyor. */
  const entries = xml.split('<entry>').slice(1).filter(e => !e.includes('/shorts/')).slice(0, max);
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

/* revalidateSeconds: /videos saatte bir tazeleniyor. Anasayfa daha seyrek
   ister — her tazeleme bir ISR yazımı demek, anasayfanın geri kalanı da
   zaten yalnızca yeni yazı eklenince değişiyor. */
export async function getVideos(category?: string, revalidateSeconds = 3600): Promise<VideoItem[]> {
  const channels =
    category && category !== 'all'
      ? CHANNELS.filter(c => c.category === category)
      : CHANNELS;

  const results = await Promise.allSettled(
    channels.map(async ch => {
      const res = await fetch(
        `https://www.youtube.com/feeds/videos.xml?channel_id=${ch.id}`,
        { next: { revalidate: revalidateSeconds } }
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
  { id: 'technology', label: 'Technology' },
  { id: 'gaming',     label: 'Gaming' },
];

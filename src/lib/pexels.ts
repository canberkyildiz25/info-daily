const PEXELS_API = 'https://api.pexels.com/v1/search';

export async function getPexelsImage(query: string, seed?: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      `${PEXELS_API}?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      {
        headers: { Authorization: apiKey },
        next: { revalidate: 86400 }, // cache 24h
      }
    );

    if (!res.ok) return null;

    const data = await res.json() as {
      photos: Array<{ src: { large2x: string; large: string } }>;
    };

    if (!data.photos?.length) return null;

    // Consistent pick based on seed so same query always returns same image
    const str = seed ?? query;
    const idx = Math.abs(str.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % data.photos.length;
    return data.photos[idx].src.large2x || data.photos[idx].src.large;
  } catch {
    return null;
  }
}

// Fallback: Unsplash Source (no API key needed)
export function getUnsplashFallback(query: string, seed: string): string {
  const keywords = encodeURIComponent(query.split(' ').slice(0, 3).join(','));
  const sig = Math.abs(seed.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0) % 1000);
  return `https://source.unsplash.com/1200x675/?${keywords}&sig=${sig}`;
}

export async function getCoverImageUrl(query: string, seed: string): Promise<string> {
  const pexels = await getPexelsImage(query, seed);
  if (pexels) return pexels;
  return getUnsplashFallback(query, seed);
}

import { getAllPosts, CATEGORIES } from '@/lib/posts';
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const now = Date.now();
  const postEntries: MetadataRoute.Sitemap = posts.map(post => {
    const daysOld = (now - new Date(post.date).getTime()) / (1000 * 60 * 60 * 24);
    return {
      url: `${SITE_URL}/${post.category}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'never' as const,
      priority: daysOld < 7 ? 0.9 : daysOld < 30 ? 0.8 : 0.6,
    };
  });

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
    url: `${SITE_URL}/category/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/about`, lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date('2026-04-01'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date('2026-04-01'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticEntries,
    ...categoryEntries,
    ...postEntries,
  ];
}

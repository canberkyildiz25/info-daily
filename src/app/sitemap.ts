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

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryEntries,
    ...postEntries,
  ];
}

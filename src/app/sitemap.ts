import { getAllPosts, CATEGORIES } from '@/lib/posts';
import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.infodaily.net';
const SITE_UPDATED_AT = new Date('2026-08-28T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPostDate = posts.reduce((latest, post) => {
    const candidate = new Date(post.updatedAt ?? post.date);
    return candidate > latest ? candidate : latest;
  }, new Date(0));

  const now = Date.now();
  const postEntries: MetadataRoute.Sitemap = posts.map(post => {
    const effectiveDate = post.updatedAt ?? post.date;
    const daysOld = (now - new Date(effectiveDate).getTime()) / (1000 * 60 * 60 * 24);
    return {
      url: `${SITE_URL}/${post.category}/${post.slug}`,
      lastModified: new Date(effectiveDate),
      changeFrequency: 'monthly' as const,
      priority: daysOld < 7 ? 0.9 : daysOld < 30 ? 0.8 : 0.6,
    };
  });

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map(cat => {
    const latestCategoryPost = posts
      .filter(post => post.category === cat.slug)
      .reduce((latest, post) => {
        const candidate = new Date(post.updatedAt ?? post.date);
        return candidate > latest ? candidate : latest;
      }, new Date(0));

    return {
      url: `${SITE_URL}/category/${cat.slug}`,
      lastModified: latestCategoryPost.getTime() ? latestCategoryPost : SITE_UPDATED_AT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    };
  });

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/articles`, lastModified: latestPostDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/authors`, lastModified: SITE_UPDATED_AT, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/videos`, lastModified: SITE_UPDATED_AT, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${SITE_URL}/games`, lastModified: new Date('2026-07-02'), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/about`, lastModified: SITE_UPDATED_AT, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date('2026-04-01'), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date('2026-04-01'), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified: new Date('2026-04-01'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [
    {
      url: SITE_URL,
      lastModified: latestPostDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    ...staticEntries,
    ...categoryEntries,
    ...postEntries,
  ];
}

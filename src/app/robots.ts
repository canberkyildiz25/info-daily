import type { MetadataRoute } from 'next';

const SITE_URL = 'https://your-domain.com'; // Replace with your actual domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

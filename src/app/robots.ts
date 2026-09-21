import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* /news is gone entirely now — the route, the feed and the component.
         The rule stays behind it on purpose: crawlers hold URLs for a long
         time, and there is no reason to let them keep fetching an unbounded
         query-string space that no longer answers. */
      disallow: ['/api/', '/news'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

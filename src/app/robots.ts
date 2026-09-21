import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      /* /news takes the whole article in its query string — title, description,
         image, source, url, timestamp, content — so every headline the homepage
         shows produces a distinct URL, and the homepage shows new headlines
         every time it regenerates. That is an unbounded URL space, and each of
         those URLs runs a function that calls the Anthropic API to expand the
         summary. Crawlers were walking all of it.

         The page already sets robots noindex, so nothing here was meant to be
         in the index and nothing is being removed from it: Search Console shows
         every impression this site has ever had landing on `/`. */
      disallow: ['/api/', '/news'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

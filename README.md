# InfoDaily

Technology and gaming guides on their own domain: how to get more out of the hardware and software you already own.

**Live:** https://www.infodaily.net

The site is a Next.js app that reads its articles from Markdown files in this repository. There is no database behind the reading pages and no CMS. Adding a guide is adding a file.

## What is on the site

- **Guides in two sections**, technology and gaming, each article a Markdown file with its title, date, author, cover and tags in front matter.
- **A front page led by one guide**, then an index whose bands each have a different shape.
- **An article page built for reading**: one column, a table of contents beside it, the reading time, the date it was last updated, sources at the foot, and links to related guides.
- **Search** over every article, from an index built on the server.
- **Authors and categories**, each with its own page.
- **Videos**: reviews from a short list of channels, chosen by hand.
- **Five small games** that run in the browser: 2048, Breakout, Memory, Snake and Tic-tac-toe.
- **A newsletter.** Sign up from any page; a scheduled job sends the new guides.
- **Notifications**, for readers who ask for them, through the browser's push service.
- **An RSS feed**, a sitemap, structured data on every article, and a share image drawn per page.
- **Light and dark**, and a choice of reading typeface.
- About, contact, privacy and terms pages.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS 4 with the typography plugin
- Markdown through gray-matter and remark
- Resend for the newsletter, web-push for notifications, Upstash Redis to remember who subscribed
- Formspree for the contact form
- Vercel for hosting, analytics and the scheduled job

## Run it

Node 20 or newer.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # the production build
npm start        # serve that build
npm run lint
```

The reading pages need nothing set. The features that talk to a service each need their own keys, and are simply off without them:

| Variable | What it is for |
| --- | --- |
| `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` | Sending the newsletter and keeping its list |
| `CRON_SECRET` | Lets only the scheduler call the newsletter job |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Signing push notifications |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Storing push subscriptions |
| `PEXELS_API_KEY` | Looking up photographs |
| `NEWS_API_KEY` | The gaming news feed |

Keep them in `.env.local`, which is not committed.

## Writing a guide

Add a Markdown file under `content/posts/technology/` or `content/posts/gaming/`. The file name is the address.

```markdown
---
title: "How to Choose a Gaming Monitor"
excerpt: "One or two sentences that say what the reader will be able to do."
date: "2026-07-01"
updatedAt: "2026-07-02"
author: Canberk Yildiz
coverImage: "https://images.unsplash.com/..."
tags: ["gaming monitor", "refresh rate"]
---

The article, in Markdown.
```

The table of contents, the reading time, the related guides and the structured data are worked out from the file.

## Layout of the code

```
content/posts/           the guides, as Markdown, in technology/ and gaming/
src/app/
  page.tsx               the front page
  [category]/[slug]/     an article
  articles/, category/, author/, authors/, videos/, games/
  about/, contact/, privacy-policy/, terms/
  feed.xml/, sitemap.ts, robots.ts, opengraph-image.tsx
  api/                   search-index, subscribe, push, gaming-news, cron/newsletter
src/components/          the interface, one file per piece
src/lib/
  posts.ts               reads the Markdown and everything derived from it
  categories.ts, authors.ts, videos.ts
  typeset.tsx            the small typographic fixes applied to article text
  rss.ts, images.ts, pexels.ts
public/games/            the five games, each one a single file
scripts/                 indexnow.js, search-console.js and a few one-off fixes
design.md                the design system and its rules
vercel.json              the schedule for the newsletter job
```

## Deploying

The live site is on Vercel and builds from `main`. `vercel.json` schedules the newsletter job once a day.

```bash
npm run indexnow:new     # tell search engines about new addresses
npm run gsc              # read how the site is doing in Search Console
```

## Author

[Canberk Yıldız](https://canberkyildiz.netlify.app)

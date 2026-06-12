import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CONTENT_CALENDAR } from '@/lib/content-calendar';
import { fetchTrendingTopics } from '@/lib/rss';

export const maxDuration = 60;

const CATEGORY_AUTHORS: Record<string, string> = {
  health: 'Dr. Sarah Collins',
  finance: 'James Park, CFP',
  technology: 'Alex Rivera',
  'life-hacks': 'Emma Johnson',
  travel: 'Sophie Martinez',
  food: 'Maria Chen',
  business: 'David Kim',
  science: 'Dr. Lena Fischer',
  relationships: 'Jessica Morgan',
};

// Verified working Unsplash photo IDs per category
const CATEGORY_PHOTOS: Record<string, string[]> = {
  health: [
    'photo-1506126613408-eca07ce68773', // walking in nature
    'photo-1544367567-0f2fcb009e0b',    // stretching yoga
    'photo-1498837167922-ddd27525d352',  // healthy food
    'photo-1571019613454-1cb2f99b2d8b',  // fitness workout
    'photo-1559757148-5c350d0d3c56',    // meditation calm
  ],
  finance: [
    'photo-1611974789855-9c2a0a7236a3', // stock chart
    'photo-1579621970563-ebec7560ff3e', // savings coins
    'photo-1554224155-8d04cb21cd6c',    // calculator budget
    'photo-1560472355-536de3962603',    // money planning
    'photo-1565514020179-026b92b84bb6', // investment growth
  ],
  technology: [
    'photo-1620712943543-bcc4688e7485', // AI digital
    'photo-1518770660439-4636190af475',  // circuit board
    'photo-1496181133206-80ce9b88a853',  // laptop code
    'photo-1551650975-87deedd944c3',    // smartphone tech
    'photo-1593508512255-86ab42a8e620',  // VR glasses
  ],
  'life-hacks': [
    'photo-1587829741301-dc798b83add3', // keyboard shortcuts
    'photo-1484480974693-6ca0a78fb36b',  // productivity planner
    'photo-1499750310107-5fef28a66643',  // morning routine
    'photo-1434030216411-0b793f4b4173',  // studying focus
    'photo-1506905925346-21bda4d32df4',  // mountain sunrise
  ],
  travel: [
    'photo-1467269204594-9661b134dd2b', // Europe travel
    'photo-1488646953014-85cb44e25828',  // travel planning map
    'photo-1476514525535-07fb3b4ae5f1',  // scenic destination
    'photo-1501854140801-50d01698950b',  // mountains landscape
    'photo-1530521954074-e64f6810b32d',  // city skyline
  ],
  food: [
    'photo-1525351484163-7529414344d8', // breakfast eggs
    'photo-1543353071-087092ec393a',    // meal prep bowls
    'photo-1466637574441-749b8f19452f',  // cooking kitchen
    'photo-1512621776951-a57141f2eefd',  // healthy salad
    'photo-1504674900247-0877df9cc836',  // food spread
  ],
  business: [
    'photo-1596526131083-e8c633c948d2', // email laptop
    'photo-1507679799987-c73779587ccf',  // business suit
    'photo-1573496359142-b8d87734a5a2',  // professional meeting
    'photo-1454165804606-c3d57bc86b40',  // business planning
    'photo-1486406146926-c627a92ad1ab',  // office building
  ],
  science: [
    'photo-1541781774459-bb2af2f05b55', // sleep brain
    'photo-1518152006812-edab29b069ac',  // science lab
    'photo-1532094349884-543290bf8bf5',  // microscope research
    'photo-1451187580459-43490279c0fa',  // space cosmos
    'photo-1507413245164-6160d8298b31',  // data science
  ],
  relationships: [
    'photo-1529156069898-49953e39b3ac', // people talking
    'photo-1516589178581-6cd7833ae3b2',  // couple together
    'photo-1511632765486-a01980e01a18',  // friends laughing
    'photo-1573497161161-c3e73707e25c',  // conversation
    'photo-1491438590914-bc09fcaaf77a',  // community people
  ],
  entertainment: [
    'photo-1522869635100-9f4c5e86aa37', // streaming TV
    'photo-1489599849927-2ee91cede3ba',  // movie theater
    'photo-1493225457124-a3eb161ffa5f',  // music concert
    'photo-1581876832484-c6a6a1aee7b2',  // gaming controller
    'photo-1574375927938-d5a98e8ffe85',  // entertainment screen
  ],
};

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getCoverImage(category: string, title: string): string {
  const photos = CATEGORY_PHOTOS[category] ?? CATEGORY_PHOTOS.technology;
  const idx = Math.abs(title.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0)) % photos.length;
  return `https://images.unsplash.com/${photos[idx]}?w=1200&q=80`;
}

async function fileExistsInGitHub(filePath: string, token: string, repo: string): Promise<boolean> {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
    },
    cache: 'no-store',
  });
  return res.status === 200;
}

async function commitFileToGitHub(
  filePath: string,
  content: string,
  title: string,
  token: string,
  repo: string,
): Promise<void> {
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const encodedContent = Buffer.from(content, 'utf8').toString('base64');

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `chore: add article - ${title}`,
      content: encodedContent,
      branch: 'main',
    }),
  });

  if (!res.ok) {
    const error = await res.json() as { message?: string };
    throw new Error(`GitHub API error: ${error.message ?? res.status}`);
  }
}

// Categories rotated by day-of-week so content spreads evenly
const DAILY_CATEGORIES = [
  ['finance', 'technology'],
  ['health', 'business'],
  ['science', 'life-hacks'],
  ['travel', 'food'],
  ['relationships', 'entertainment'],
  ['finance', 'health'],
  ['technology', 'science'],
];

export async function GET(req: NextRequest) {
  // Vercel Cron authentication
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) return NextResponse.json({ error: 'GITHUB_TOKEN not set' }, { status: 500 });

  const githubRepo = process.env.GITHUB_REPO;
  if (!githubRepo) return NextResponse.json({ error: 'GITHUB_REPO not set' }, { status: 500 });

  const countParam = req.nextUrl.searchParams.get('count');
  const count = Math.min(parseInt(countParam || '2', 10), 5);

  // Which categories to target today (rotate by day of week, overridable via ?categories=finance,health)
  const categoriesParam = req.nextUrl.searchParams.get('categories');
  const dayIndex = new Date().getDay();
  const todayCategories = categoriesParam
    ? categoriesParam.split(',').map(c => c.trim())
    : DAILY_CATEGORIES[dayIndex];

  const generated: { title: string; category: string; slug: string; source: 'rss' | 'calendar' }[] = [];
  const skipped: string[] = [];
  const client = new Anthropic({ apiKey });

  for (const category of todayCategories) {
    if (generated.length >= count) break;

    // 1. Try RSS first
    let topics: string[] = [];
    try {
      topics = await fetchTrendingTopics(category, 10);
    } catch {
      // RSS failed — fall through to calendar
    }

    // 2. Fall back to CONTENT_CALENDAR for this category
    if (topics.length === 0) {
      topics = CONTENT_CALENDAR
        .filter(item => item.category === category)
        .map(item => item.title);
    }

    for (const rawTopic of topics) {
      if (generated.length >= count) break;

      const slug = titleToSlug(rawTopic);
      const filePath = `content/posts/${category}/${slug}.md`;

      const exists = await fileExistsInGitHub(filePath, githubToken, githubRepo);
      if (exists) continue;

      const coverImage = getCoverImage(category, rawTopic);
      const today = new Date().toISOString().split('T')[0];

      // Claude writes a fully original article inspired by the topic.
      // We pass only the topic/headline — never any article body from the source.
      const prompt = `You are an expert content writer for InfoDaily. Write a comprehensive, SEO-optimized article inspired by this topic: "${rawTopic}"

IMPORTANT:
- Write 100% original content. Do NOT copy, paraphrase, or summarize any specific news article.
- If the topic is a breaking news headline, write a timeless, practical article about the underlying subject.
- Focus on what readers can learn or do — not on reporting a specific event.

REQUIREMENTS:
- Length: 900-1300 words
- Use ## and ### headings
- Practical, actionable advice with real examples
- Friendly, authoritative tone
- Bullet points and numbered lists where helpful
- At least one statistic or study reference
- Do NOT include the title as a heading at the top
- Start with the opening paragraph directly

OUTPUT — Return ONLY this format, nothing before or after:
---
title: "[SEO-optimized article title based on the topic — rewrite if needed to be evergreen]"
excerpt: "[Compelling 1-2 sentence description, 120-155 characters]"
date: "${today}"
author: "${CATEGORY_AUTHORS[category] ?? 'InfoDaily Editorial Team'}"
coverImage: "${coverImage}"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
---

[Article content]`;

      try {
        const message = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 2500,
          messages: [{ role: 'user', content: prompt }],
        });

        let content = (message.content[0] as { text: string }).text;

        if (!content.startsWith('---')) {
          const idx = content.indexOf('---');
          if (idx >= 0 && idx < 150) content = content.slice(idx);
          else throw new Error('Missing frontmatter in generated content');
        }

        // Extract the actual title Claude chose (may differ from raw RSS headline)
        const titleMatch = content.match(/^title:\s*"([^"]+)"/m);
        const finalTitle = titleMatch?.[1] ?? rawTopic;
        const finalSlug = titleToSlug(finalTitle);
        const finalPath = `content/posts/${category}/${finalSlug}.md`;

        await commitFileToGitHub(finalPath, content.trim() + '\n', finalTitle, githubToken, githubRepo);
        generated.push({ title: finalTitle, category, slug: finalSlug, source: topics === CONTENT_CALENDAR.map(i => i.title) ? 'calendar' : 'rss' });

        // Push notification
        try {
          const excerptMatch = content.match(/excerpt:\s*"([^"]+)"/);
          const excerpt = excerptMatch?.[1] ?? 'A new article is waiting for you!';
          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.infodaily.net'}/api/push/send`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.CRON_SECRET}`,
            },
            body: JSON.stringify({
              title: finalTitle,
              excerpt,
              url: `https://www.infodaily.net/${category}/${finalSlug}`,
              category,
            }),
          });
        } catch {
          // Push failure should not block article generation
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        skipped.push(`${rawTopic}: ${msg}`);
      }
    }
  }

  return NextResponse.json({
    generated,
    skipped,
    categoriesTargeted: todayCategories,
    count: generated.length,
  });
}

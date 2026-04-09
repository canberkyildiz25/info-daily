import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CONTENT_CALENDAR } from '@/lib/content-calendar';

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

const CATEGORY_KEYWORDS: Record<string, string> = {
  health: 'healthy lifestyle wellness',
  finance: 'money finance investment',
  technology: 'technology computer digital',
  'life-hacks': 'productivity workspace minimal',
  travel: 'travel adventure landscape',
  food: 'food cooking delicious',
  business: 'business office professional',
  science: 'science laboratory nature',
  relationships: 'people connection friendship',
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
  const stopWords = new Set(['the','a','an','of','to','for','in','on','at','with','how','best','top','ways','tips','what','why','is','are','you','your']);
  const titleWords = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(' ')
    .filter(w => w.length > 3 && !stopWords.has(w))
    .slice(0, 2);
  const catKw = (CATEGORY_KEYWORDS[category] || category).split(' ')[0];
  const keywords = [...titleWords, catKw].join(',');
  const seed = Math.abs(title.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0) % 1000);
  return `https://source.unsplash.com/800x450/?${encodeURIComponent(keywords)}&sig=${seed}`;
}

// Find the next article from the calendar that hasn't been generated yet
function getNextPending(): { title: string; category: string } | null {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  for (const item of CONTENT_CALENDAR) {
    const slug = titleToSlug(item.title);
    const filePath = path.join(postsDir, item.category, `${slug}.md`);
    if (!fs.existsSync(filePath)) return item;
  }
  return null; // All articles generated!
}

export async function GET(req: NextRequest) {
  // Vercel Cron authentication
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
  }

  // How many articles to generate per cron run (default: 2)
  const countParam = req.nextUrl.searchParams.get('count');
  const count = Math.min(parseInt(countParam || '2', 10), 5);

  const generated = [];
  const skipped = [];

  const client = new Anthropic({ apiKey });

  for (let i = 0; i < count; i++) {
    const next = getNextPending();
    if (!next) {
      skipped.push('Content calendar complete — no more pending articles');
      break;
    }

    const { title, category } = next;
    const slug = titleToSlug(title);
    const outputPath = path.join(process.cwd(), 'content', 'posts', category, `${slug}.md`);
    const coverImage = getCoverImage(category, title);
    const today = new Date().toISOString().split('T')[0];

    const prompt = `You are an expert content writer for InfoDaily. Write a comprehensive, SEO-optimized article about: "${title}"

REQUIREMENTS:
- Length: 900-1300 words
- Use ## and ### headings
- Practical, actionable advice with real examples
- Friendly, authoritative tone
- Bullet points and numbered lists where helpful
- At least one statistic or study reference
- Do NOT include the title as a heading at the top
- Start with the opening paragraph directly

OUTPUT — Return ONLY this format:
---
title: "${title}"
excerpt: "[Compelling 1-2 sentence description, 120-155 characters]"
date: "${today}"
author: "${CATEGORY_AUTHORS[category]}"
coverImage: "${coverImage}"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
---

[Article content]`;

    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001', // Faster + cheaper for automated runs
        max_tokens: 2500,
        messages: [{ role: 'user', content: prompt }],
      });

      let content = (message.content[0] as { text: string }).text;
      if (!content.startsWith('---')) {
        const idx = content.indexOf('---');
        if (idx >= 0 && idx < 150) content = content.slice(idx);
        else throw new Error('Missing frontmatter');
      }

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, content.trim() + '\n', 'utf8');
      generated.push({ title, category, slug, url: `/${category}/${slug}` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      skipped.push(`${title}: ${message}`);
    }
  }

  // Stats
  const total = CONTENT_CALENDAR.length;
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  const done = CONTENT_CALENDAR.filter(({ title, category }) => {
    const slug = titleToSlug(title);
    return fs.existsSync(path.join(postsDir, category, `${slug}.md`));
  }).length;

  return NextResponse.json({
    generated,
    skipped,
    calendar: { total, done, remaining: total - done },
  });
}

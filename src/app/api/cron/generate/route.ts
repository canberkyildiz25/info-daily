import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { CONTENT_CALENDAR } from '@/lib/content-calendar';

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

  const githubRepo = process.env.GITHUB_REPO; // e.g. "canberkyildiz25/info-daily"
  if (!githubRepo) return NextResponse.json({ error: 'GITHUB_REPO not set' }, { status: 500 });

  // Default 1 article per run (safe for Vercel free plan timeout)
  const countParam = req.nextUrl.searchParams.get('count');
  const count = Math.min(parseInt(countParam || '1', 10), 3);

  const generated: { title: string; category: string; slug: string }[] = [];
  const skipped: string[] = [];
  const client = new Anthropic({ apiKey });

  for (const item of CONTENT_CALENDAR) {
    if (generated.length >= count) break;

    const { title, category } = item;
    const slug = titleToSlug(title);
    const filePath = `content/posts/${category}/${slug}.md`;

    // Check existence via GitHub API (filesystem is read-only on Vercel)
    const exists = await fileExistsInGitHub(filePath, githubToken, githubRepo);
    if (exists) continue;

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

OUTPUT — Return ONLY this format, nothing before or after:
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

      await commitFileToGitHub(filePath, content.trim() + '\n', title, githubToken, githubRepo);
      generated.push({ title, category, slug });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      skipped.push(`${title}: ${msg}`);
    }
  }

  const total = CONTENT_CALENDAR.length;
  const done = generated.length;

  return NextResponse.json({
    generated,
    skipped,
    calendar: { total, done, remaining: total - done },
  });
}

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';

// Load env vars manually
const envContent = readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim();
}

const ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY;

const CATEGORY_AUTHORS = {
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

const CATEGORY_KEYWORDS = {
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

function titleToSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
}

async function getCoverImage(category, title) {
  const pexelsKey = env.PEXELS_API_KEY;
  if (pexelsKey) {
    const stopWords = new Set(['the','a','an','of','to','for','in','on','at','with','how','best','top','ways','tips']);
    const titleWords = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
      .filter(w => w.length > 3 && !stopWords.has(w)).slice(0, 3);
    const catKw = (CATEGORY_KEYWORDS[category] || category).split(' ')[0];
    const query = [...titleWords, catKw].join(' ');
    const slug = titleToSlug(title);
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.photos?.length) {
          const idx = Math.abs(slug.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % data.photos.length;
          const url = data.photos[idx].src.large2x || data.photos[idx].src.large;
          if (url) return url;
        }
      }
    } catch {}
  }
  // Fallback: stable picsum seed (last resort)
  const seed = Math.abs(title.split('').reduce((acc, c) => acc * 31 + c.charCodeAt(0), 0) % 1000);
  return `https://picsum.photos/seed/${seed}/800/450`;
}

const title = process.argv[2];
const category = process.argv[3];

if (!title || !category) {
  console.error('Usage: node generate-article.mjs "Title" "category"');
  process.exit(1);
}

if (!ANTHROPIC_API_KEY) { console.error('Missing ANTHROPIC_API_KEY'); process.exit(1); }

const slug = titleToSlug(title);
const filePath = `content/posts/${category}/${slug}.md`;
console.log('Fetching cover image from Pexels...');
const coverImage = await getCoverImage(category, title);
const today = new Date().toISOString().split('T')[0];

console.log(`Generating: "${title}" [${category}]`);
console.log(`Slug: ${slug}`);

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

const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
console.log('Calling Claude API...');
const message = await client.messages.create({
  model: 'claude-haiku-4-5-20251001',
  max_tokens: 2500,
  messages: [{ role: 'user', content: prompt }],
});

let content = message.content[0].text;
if (!content.startsWith('---')) {
  const idx = content.indexOf('---');
  if (idx >= 0 && idx < 150) content = content.slice(idx);
  else { console.error('Generated content missing frontmatter'); process.exit(1); }
}

mkdirSync(dirname(filePath), { recursive: true });
writeFileSync(filePath, content.trim() + '\n', 'utf8');
console.log(`\nSaved to ${filePath}`);

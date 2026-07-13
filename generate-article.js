#!/usr/bin/env node
/**
 * InfoDaily — AI Article Generator
 *
 * Single article:
 *   node generate-article.js "10 Best Foods for Weight Loss" health
 *
 * Batch from file (one "title | category" per line):
 *   node generate-article.js --batch articles.txt
 *
 * Setup:
 *   set ANTHROPIC_API_KEY=sk-ant-...   (Windows)
 *   export ANTHROPIC_API_KEY=sk-ant-... (Mac/Linux)
 */

const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs');
const path = require('path');

const VALID_CATEGORIES = [
  'health', 'finance', 'technology', 'life-hacks',
  'travel', 'food', 'business', 'science', 'relationships', 'entertainment', 'gaming',
];

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
  entertainment: 'Maria Chen',
  gaming: 'Alex Rivera',
};

// Unsplash keyword map — no API key needed (Source API)
const CATEGORY_UNSPLASH_KEYWORDS = {
  health: 'healthy lifestyle wellness',
  finance: 'money finance investment',
  technology: 'technology computer digital',
  'life-hacks': 'productivity workspace minimal',
  travel: 'travel adventure landscape',
  food: 'food cooking delicious',
  business: 'business office professional',
  science: 'science laboratory nature',
  relationships: 'people connection friendship',
  entertainment: 'cinema music entertainment',
  gaming: 'video games gaming setup',
};

function titleToSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function getCoverImageFromPexels(category, title) {
  const pexelsKey = process.env.PEXELS_API_KEY;
  if (!pexelsKey) return null;
  const stopWords = new Set(['the','a','an','of','to','for','in','on','at','with','how','best','top','ways','tips','guide','what','why','when','where','who']);
  const titleWords = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(' ')
    .filter(w => w.length > 3 && !stopWords.has(w)).slice(0, 3);
  const catKw = (CATEGORY_UNSPLASH_KEYWORDS[category] || category).split(' ')[0];
  const query = [...titleWords, catKw].join(' ') || catKw;
  const slug = titleToSlug(title);
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
      { headers: { Authorization: pexelsKey } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.photos?.length) return null;
    const idx = Math.abs(slug.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % data.photos.length;
    return data.photos[idx].src.large2x || data.photos[idx].src.large || null;
  } catch { return null; }
}

async function generateArticle(title, category, client) {
  if (!VALID_CATEGORIES.includes(category)) {
    throw new Error(`Invalid category "${category}". Valid: ${VALID_CATEGORIES.join(', ')}`);
  }

  const today = new Date().toISOString().split('T')[0];
  const currentYear = new Date().getFullYear();
  const slug = titleToSlug(title);
  const outputPath = path.join('content', 'posts', category, `${slug}.md`);

  if (fs.existsSync(outputPath)) {
    throw new Error(`Article already exists: ${outputPath}`);
  }

  process.stdout.write(`  Fetching cover image... `);
  const coverImage = await getCoverImageFromPexels(category, title) ||
    `https://picsum.photos/seed/${Math.abs(slug.split('').reduce((a,c)=>a*31+c.charCodeAt(0),0)%1000)}/800/450`;
  process.stdout.write('✓\n');

  const prompt = `You are an expert content writer for InfoDaily, a knowledge website. Write a comprehensive, SEO-optimized article about: "${title}"

IMPORTANT: Today's date is ${today}. The current year is ${currentYear}. If the title contains a year, use that year consistently throughout the article. Do NOT use outdated years (e.g. if title says ${currentYear}, never write ${currentYear - 1} as the current year in the content).

REQUIREMENTS:
- Length: 900-1300 words of actual content
- Use ## and ### headings to break up sections
- Include practical, actionable advice with real examples
- Friendly, authoritative tone — not academic or stiff
- Use bullet points, numbered lists where helpful
- Include at least one relevant statistic or study reference
- Do NOT include the title as a heading at the top
- Start directly with the opening paragraph

OUTPUT — Return ONLY this exact format, nothing before or after:
---
title: "${title}"
excerpt: "[Write a curiosity-driven 1-2 sentence meta description. Include a benefit or intriguing hook. 130-155 characters. No generic phrases like 'In this article' or 'Learn about'.]"
date: "${today}"
author: "${CATEGORY_AUTHORS[category]}"
coverImage: "${coverImage}"
tags: ["tag1", "tag2", "tag3", "tag4", "tag5"]
---

[Article content starting with the first paragraph]`;

  let fullContent = '';
  process.stdout.write(`  Generating "${title}" `);

  const stream = await client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 2500,
    messages: [{ role: 'user', content: prompt }],
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      fullContent += chunk.delta.text;
      process.stdout.write('.');
    }
  }

  console.log(' ✓');

  if (!fullContent.startsWith('---')) {
    // Try to find and strip any preamble before ---
    const idx = fullContent.indexOf('---');
    if (idx > 0 && idx < 100) {
      fullContent = fullContent.slice(idx);
    } else {
      throw new Error('Generated content missing frontmatter');
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, fullContent.trim() + '\n', 'utf8');
  return { slug, outputPath };
}

async function runBatch(batchFile, client) {
  if (!fs.existsSync(batchFile)) {
    throw new Error(`Batch file not found: ${batchFile}`);
  }

  const lines = fs.readFileSync(batchFile, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'));

  console.log(`\n📋 Batch mode — ${lines.length} articles\n`);

  const results = { success: [], failed: [] };

  for (const line of lines) {
    const parts = line.split('|').map(p => p.trim());
    if (parts.length !== 2) {
      console.log(`  ⚠ Skipping invalid line: "${line}" (expected "title | category")`);
      results.failed.push({ line, error: 'Invalid format' });
      continue;
    }

    const [title, category] = parts;
    try {
      const { outputPath } = await generateArticle(title, category, client);
      results.success.push({ title, outputPath });
    } catch (err) {
      console.log(`  ✗ Failed: ${err.message}`);
      results.failed.push({ title, error: err.message });
    }
  }

  console.log(`\n📊 Done — ${results.success.length} created, ${results.failed.length} failed`);
  if (results.success.length > 0) {
    console.log('\nCreated:');
    results.success.forEach(r => console.log(`  ✅ ${r.outputPath}`));
  }
  if (results.failed.length > 0) {
    console.log('\nFailed:');
    results.failed.forEach(r => console.log(`  ❌ ${r.title || r.line}: ${r.error}`));
  }
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set.');
    console.error('   Windows: set ANTHROPIC_API_KEY=sk-ant-...');
    console.error('   Mac/Linux: export ANTHROPIC_API_KEY=sk-ant-...');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const args = process.argv.slice(2);

  if (args[0] === '--batch') {
    const batchFile = args[1];
    if (!batchFile) {
      console.error('Usage: node generate-article.js --batch articles.txt');
      process.exit(1);
    }
    await runBatch(batchFile, client);
    return;
  }

  const [title, category] = args;
  if (!title || !category) {
    console.log('Usage:');
    console.log('  node generate-article.js "Article Title" <category>');
    console.log('  node generate-article.js --batch articles.txt');
    console.log('\nCategories:', VALID_CATEGORIES.join(', '));
    console.log('\nBatch file format (one per line):');
    console.log('  How to Save Money Every Day | finance');
    console.log('  Best Foods for Brain Health | health');
    process.exit(1);
  }

  console.log(`\n📝 Article: "${title}"`);
  console.log(`📂 Category: ${category}\n`);

  const { slug, outputPath } = await generateArticle(title, category, client);

  console.log(`\n✅ Saved: ${outputPath}`);
  console.log(`🌐 URL: http://localhost:3000/${category}/${slug}\n`);
}

main().catch(err => {
  console.error('\n❌', err.message);
  process.exit(1);
});

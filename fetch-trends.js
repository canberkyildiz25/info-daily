#!/usr/bin/env node
/**
 * InfoDaily — Trend Topic Fetcher
 *
 * Sources: Google News RSS + Reddit /r/all
 * Claude picks relevant topics → writes daily-topics.txt
 *
 * Usage:
 *   node fetch-trends.js
 *   node fetch-trends.js --count 5
 *   node fetch-trends.js --out=daily-topics.txt
 */

const Anthropic = require('@anthropic-ai/sdk');
const https = require('https');
const fs = require('fs');

const VALID_CATEGORIES = [
  'health', 'finance', 'technology', 'life-hacks',
  'travel', 'food', 'business', 'science', 'relationships', 'entertainment',
];

const args = process.argv.slice(2);
const countIndex = args.indexOf('--count');
const COUNT = countIndex !== -1 ? parseInt(args[countIndex + 1]) : 4;
const OUTPUT_FILE = args.find(a => a.startsWith('--out='))?.split('=')[1] || 'daily-topics.txt';

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; InfoDailyBot/1.0)',
        'Accept': 'application/rss+xml, application/json, text/xml, */*',
      },
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchGoogleNews() {
  try {
    const { status, body } = await fetchUrl(
      'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en'
    );
    if (status !== 200) return [];

    const titles = [];
    const regex = /<title>([^<]+)<\/title>/g;
    let match;
    while ((match = regex.exec(body)) !== null) {
      const t = match[1].trim();
      // Skip the feed-level title
      if (t && t !== 'Google News' && t.length > 5) {
        // Strip source attribution (e.g. "Title - Reuters")
        const clean = t.replace(/\s+-\s+[^-]+$/, '').trim();
        if (clean.length > 5) titles.push(clean);
      }
    }
    return titles.slice(0, 30);
  } catch {
    return [];
  }
}

async function fetchRedditTrending() {
  try {
    const { status, body } = await fetchUrl(
      'https://www.reddit.com/r/all/hot.json?limit=25'
    );
    if (status !== 200) return [];

    const data = JSON.parse(body);
    return data.data.children
      .map(p => p.data.title)
      .filter(t => t && t.length > 10)
      .slice(0, 25);
  } catch {
    return [];
  }
}

async function selectAndGenerateTitles(allTopics, count, client) {
  const today = new Date().toISOString().split('T')[0];

  const prompt = `Today is ${today}. You are an editor for InfoDaily, an English-language content website.

Our site covers: health, finance, technology, life-hacks, travel, food, business, science, relationships, entertainment.

Here are today's trending news headlines and topics:
${allTopics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Your task: pick ${count} of these that you can turn into a useful, readable article — then write a proper article TITLE for each.

SELECTION CRITERIA:
✅ Pick trends about: health topics, money/finance, career, relationships, lifestyle, entertainment (movies/music/TV), technology, science discoveries, travel
✅ "Who is [Person]?" → good if it's a rising celebrity or newly notable figure
✅ Major product launches, new TV shows, trending health topics, viral social phenomena
❌ Skip: pure political news, war/conflict, crime, sports scores, hyper-local stories
❌ Skip anything where you'd need breaking news to write it well

For each picked trend, write a compelling, SEO-friendly article title (not the raw headline — turn it into something people would search for).

Examples of good transformations:
- "Ozempic" → "What Is Ozempic? How It Works, Side Effects, and Who It's For"
- "Pope Leo XIV" → "Who Is Pope Leo XIV? Everything You Need to Know About the New Pope"
- "Sleep divorce trend" → "What Is 'Sleep Divorce'? Why More Couples Are Trying It"

Return ONLY a JSON array:
[
  { "title": "Article Title Here", "category": "category-slug" },
  ...
]

Valid categories: ${VALID_CATEGORIES.join(', ')}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0].text.trim();
  const jsonMatch = raw.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Claude did not return valid JSON array');

  const articles = JSON.parse(jsonMatch[0]);
  return articles
    .filter(a => a.title && VALID_CATEGORIES.includes(a.category))
    .slice(0, count);
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Fetch from multiple sources in parallel
  console.log('\n📡 Fetching trending topics...');
  const [googleNews, reddit] = await Promise.all([
    fetchGoogleNews(),
    fetchRedditTrending(),
  ]);

  console.log(`  Google News: ${googleNews.length} headlines`);
  console.log(`  Reddit /r/all: ${reddit.length} posts`);

  // Combine and deduplicate
  const allTopics = [...googleNews, ...reddit].filter(Boolean);

  if (allTopics.length === 0) {
    console.error('❌ Could not fetch any trending topics');
    process.exit(1);
  }

  console.log(`  Total: ${allTopics.length} topics`);

  console.log(`\n🤖 Selecting ${COUNT} article topics with Claude...`);
  let articles;
  try {
    articles = await selectAndGenerateTitles(allTopics, COUNT, client);
  } catch (err) {
    console.error('❌ Claude error:', err.message);
    process.exit(1);
  }

  if (articles.length === 0) {
    console.error('❌ No suitable articles found from today\'s trends');
    process.exit(1);
  }

  console.log('\n📝 Today\'s articles:');
  articles.forEach(a => console.log(`  • [${a.category}] ${a.title}`));

  const today = new Date().toISOString().split('T')[0];
  const lines = [
    `# Auto-generated from trending topics — ${today}`,
    '',
    ...articles.map(a => `${a.title} | ${a.category}`),
  ].join('\n');

  fs.writeFileSync(OUTPUT_FILE, lines + '\n', 'utf8');
  console.log(`\n✅ Written to ${OUTPUT_FILE}`);
}

main().catch(err => {
  console.error('\n❌', err.message);
  process.exit(1);
});

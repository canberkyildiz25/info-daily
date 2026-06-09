import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '..', 'content', 'posts');
const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

if (!PEXELS_API_KEY) {
  console.error('PEXELS_API_KEY not set');
  process.exit(1);
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const raw = match[1];
  // Match title - handle both quoted and unquoted
  const titleMatch = raw.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  const title = titleMatch?.[1]?.replace(/^["']|["']$/g, '') ?? '';
  // Match coverImage - handle both quoted and unquoted
  const coverMatch = raw.match(/^coverImage:\s*(.+)\s*$/m);
  const coverImage = coverMatch?.[1]?.replace(/^["']|["']$/g, '').trim() ?? '';
  return { title, coverImage };
}

function seedIndex(seed, max) {
  return Math.abs(seed.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % max;
}

async function fetchPexels(query, seed) {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`,
    { headers: { Authorization: PEXELS_API_KEY } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data.photos?.length) return null;
  const idx = seedIndex(seed, data.photos.length);
  return data.photos[idx].src.large2x || data.photos[idx].src.large;
}

function getAllMdFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...getAllMdFiles(full));
    else if (entry.name.endsWith('.md')) results.push(full);
  }
  return results;
}

function needsImageUpdate(coverImage) {
  if (!coverImage) return true;
  if (coverImage.includes('picsum.photos')) return true;
  if (coverImage.includes('source.unsplash.com')) return true;
  if (coverImage.includes('images.unsplash.com')) return true;
  if (coverImage.startsWith('/images/')) return true;
  return false;
}

const files = getAllMdFiles(CONTENT_DIR);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const fm = parseFrontmatter(content);

  if (!fm) { skipped++; continue; }
  if (!needsImageUpdate(fm.coverImage)) { skipped++; continue; }

  const category = path.basename(path.dirname(file));
  const slug = path.basename(file, '.md');
  const query = `${fm.title} ${category}`;

  process.stdout.write(`[${category}] ${slug.slice(0, 50)} ... `);

  const imageUrl = await fetchPexels(query, slug);

  if (!imageUrl) {
    console.log('FAILED');
    continue;
  }

  // Replace coverImage line regardless of quote style
  const newContent = content.replace(
    /^coverImage:.*$/m,
    `coverImage: "${imageUrl}"`
  );

  fs.writeFileSync(file, newContent, 'utf8');
  console.log('OK');
  updated++;

  await new Promise(r => setTimeout(r, 350));
}

console.log(`\nDone. Updated: ${updated} | Skipped (already OK): ${skipped}`);

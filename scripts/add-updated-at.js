/**
 * Adds updatedAt: "2026-05-18" to frontmatter of all articles that don't have it.
 * This tells Google the content was recently updated (Sources section was added).
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, '../content/posts');
const TODAY = '2026-05-18';

let updated = 0;
let skipped = 0;

const categories = fs.readdirSync(POSTS_DIR).filter(f =>
  fs.statSync(path.join(POSTS_DIR, f)).isDirectory()
);

for (const category of categories) {
  const catDir = path.join(POSTS_DIR, category);
  const files = fs.readdirSync(catDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(catDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if already has updatedAt
    if (/^updatedAt:/m.test(content)) {
      skipped++;
      continue;
    }

    // Insert updatedAt after the date: line
    const newContent = content.replace(
      /^(date:\s*["']?\d{4}-\d{2}-\d{2}["']?)$/m,
      `$1\nupdatedAt: "${TODAY}"`
    );

    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      updated++;
    } else {
      console.warn('Could not find date field in: ' + file);
      skipped++;
    }
  }
}

console.log(`Done. updatedAt added: ${updated}, skipped: ${skipped}`);

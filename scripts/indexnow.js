/**
 * Submits all article URLs to IndexNow (Bing + Yandex instant indexing).
 * Run after deploying new articles: node scripts/indexnow.js
 * Optional: pass --new-only to only submit articles from the last 3 days.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const HOST = 'www.infodaily.net';
const KEY = 'f3a8c2e1d4b57690abcdef1234567890';
const POSTS_DIR = path.join(__dirname, '../content/posts');

const newOnly = process.argv.includes('--new-only');
const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 3);

function getArticleUrls() {
  const urls = [];

  const categories = fs.readdirSync(POSTS_DIR).filter(f =>
    fs.statSync(path.join(POSTS_DIR, f)).isDirectory()
  );

  for (const category of categories) {
    const categoryDir = path.join(POSTS_DIR, category);
    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      if (newOnly) {
        const content = fs.readFileSync(path.join(categoryDir, file), 'utf-8');
        const dateMatch = content.match(/^date:\s*"?(\d{4}-\d{2}-\d{2})"?/m);
        if (dateMatch) {
          const articleDate = new Date(dateMatch[1]);
          if (articleDate < cutoffDate) continue;
        }
      }

      const slug = file.replace('.md', '');
      urls.push(`https://${HOST}/${category}/${slug}`);
    }
  }

  return urls;
}

function submitToIndexNow(urls) {
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  });

  const options = {
    hostname: 'api.indexnow.org',
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        console.log(`IndexNow response: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 202) {
          resolve();
        } else {
          console.log('Response body:', data);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const urls = getArticleUrls();
  console.log(`Submitting ${urls.length} URLs to IndexNow...`);
  if (newOnly) console.log('(last 3 days only)');

  // IndexNow accepts max 10,000 URLs per request; chunk just in case
  const chunkSize = 100;
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    await submitToIndexNow(chunk);
    console.log(`Submitted ${Math.min(i + chunkSize, urls.length)}/${urls.length}`);
  }

  console.log('Done!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});

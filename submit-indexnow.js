#!/usr/bin/env node
/**
 * IndexNow — Full site URL submission
 * Reads all markdown posts and submits them to IndexNow engines.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const KEY = 'b3557bce191f0522226379f026597e6d';
const HOST = 'www.infodaily.net';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const POSTS_DIR = path.join(__dirname, 'content', 'posts');

const ENGINES = [
  'api.indexnow.org',
  'www.bing.com',
  'search.seznam.cz',
  'yandex.com',
];

function getAllUrls() {
  const urls = [];
  const categories = fs.readdirSync(POSTS_DIR);

  for (const category of categories) {
    const categoryPath = path.join(POSTS_DIR, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'));
    for (const file of files) {
      const slug = file.replace('.md', '');
      urls.push(`https://${HOST}/${category}/${slug}`);
    }
  }

  return urls;
}

function post(hostname, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = https.request({
      hostname,
      path: '/indexnow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => resolve(res.statusCode));
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  const urls = getAllUrls();
  console.log(`\n🚀 Submitting ${urls.length} URLs via IndexNow...\n`);

  // IndexNow max 10.000 URL per request — chunk just in case
  const chunkSize = 500;
  const chunks = [];
  for (let i = 0; i < urls.length; i += chunkSize) {
    chunks.push(urls.slice(i, i + chunkSize));
  }

  for (const engine of ENGINES) {
    let total = 0;
    for (const chunk of chunks) {
      try {
        const status = await post(engine, {
          host: HOST,
          key: KEY,
          keyLocation: KEY_LOCATION,
          urlList: chunk,
        });
        if (status === 200 || status === 202) {
          total += chunk.length;
        } else {
          console.log(`⚠️  ${engine} — status ${status} for chunk of ${chunk.length}`);
        }
      } catch (err) {
        console.log(`❌ ${engine} — ${err.message}`);
      }
    }
    if (total > 0) console.log(`✅ ${engine} — ${total} URLs accepted`);
  }

  console.log('\n✅ Done.');
}

main();

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const POSTS_DIR = path.join(__dirname, '../content/posts');
const SITE_URL = 'https://www.infodaily.net';

const API_KEY = process.env.TWITTER_API_KEY;
const API_SECRET = process.env.TWITTER_API_SECRET;
const ACCESS_TOKEN = process.env.TWITTER_ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.TWITTER_ACCESS_TOKEN_SECRET;

function getNewArticles() {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - 26); // son 26 saat (günlük workflow için pay)

  const articles = [];
  const categories = fs.readdirSync(POSTS_DIR).filter(f =>
    fs.statSync(path.join(POSTS_DIR, f)).isDirectory()
  );

  for (const category of categories) {
    const dir = path.join(POSTS_DIR, category);
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8');
      const dateMatch = content.match(/^date:\s*"?(\d{4}-\d{2}-\d{2})"?/m);
      const titleMatch = content.match(/^title:\s*"?(.+?)"?\s*$/m);
      if (!dateMatch || !titleMatch) continue;

      const articleDate = new Date(dateMatch[1]);
      if (articleDate < cutoff) continue;

      const slug = file.replace('.md', '');
      articles.push({
        title: titleMatch[1].replace(/^['"]|['"]$/g, ''),
        url: `${SITE_URL}/${category}/${slug}`,
        category,
      });
    }
  }

  return articles;
}

function buildTweetText(article) {
  const categoryEmojis = {
    health: '🏥', finance: '💰', technology: '💻', food: '🍎',
    travel: '✈️', business: '💼', science: '🔬', relationships: '❤️',
    entertainment: '🎬', 'life-hacks': '💡',
  };
  const emoji = categoryEmojis[article.category] || '📰';
  const text = `${emoji} ${article.title}\n\n${article.url}`;
  return text.length <= 280 ? text : `${emoji} ${article.title.slice(0, 230)}...\n\n${article.url}`;
}

function oauthSign(method, url, params, consumerSecret, tokenSecret) {
  const sortedParams = Object.keys(params).sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&');
  const base = `${method}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  const key = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  return crypto.createHmac('sha1', key).update(base).digest('base64');
}

function postTweet(text) {
  return new Promise((resolve, reject) => {
    const url = 'https://api.twitter.com/2/tweets';
    const oauthParams = {
      oauth_consumer_key: API_KEY,
      oauth_nonce: crypto.randomBytes(16).toString('hex'),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
      oauth_token: ACCESS_TOKEN,
      oauth_version: '1.0',
    };
    oauthParams.oauth_signature = oauthSign('POST', url, oauthParams, API_SECRET, ACCESS_TOKEN_SECRET);

    const authHeader = 'OAuth ' + Object.keys(oauthParams)
      .map(k => `${encodeURIComponent(k)}="${encodeURIComponent(oauthParams[k])}"`)
      .join(', ');

    const body = JSON.stringify({ text });
    const options = {
      hostname: 'api.twitter.com',
      path: '/2/tweets',
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const articles = getNewArticles();
  if (articles.length === 0) {
    console.log('No new articles to tweet.');
    return;
  }

  console.log(`Found ${articles.length} new article(s) to tweet.`);

  for (const article of articles) {
    const text = buildTweetText(article);
    console.log(`Tweeting: ${article.title}`);
    try {
      const result = await postTweet(text);
      console.log(`Tweeted: https://twitter.com/i/web/status/${result.data.id}`);
      // Çok hızlı atma — API rate limit
      await new Promise(r => setTimeout(r, 3000));
    } catch (err) {
      console.error(`Failed to tweet "${article.title}": ${err.message}`);
    }
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

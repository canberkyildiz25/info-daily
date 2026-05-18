#!/usr/bin/env node
/**
 * Google Indexing API — URL submission script
 * Submits URLs to Google for indexing using a service account.
 */

const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

const SERVICE_ACCOUNT_FILE = './service-account.json';
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

const URLS = [
  'https://www.infodaily.net/finance/the-real-reason-youre-still-broke',
  'https://www.infodaily.net/science/scientists-identified-the-peak-focus-window',
];

async function main() {
  const credentials = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_FILE, 'utf8'));

  const auth = new GoogleAuth({
    credentials,
    scopes: SCOPES,
  });

  const client = await auth.getClient();

  console.log(`\n🚀 Submitting ${URLS.length} URLs to Google Indexing API...\n`);

  for (const url of URLS) {
    try {
      const res = await client.request({
        url: 'https://indexing.googleapis.com/v3/urlNotifications:publish',
        method: 'POST',
        data: { url, type: 'URL_UPDATED' },
      });
      console.log(`✅ ${res.status} — ${url}`);
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error?.message || err.message;
      console.log(`❌ ${status || '?'} — ${url}`);
      console.log(`   Error: ${message}`);
    }

    // 1 saniye bekle (rate limit)
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n✅ Done.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

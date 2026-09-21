#!/usr/bin/env node
/* Search Console: gösterim, tıklanma, CTR ve ortalama sıra.
 *
 * Bu, service-account.json'ın gerçekten işe yarayan tek kullanımı. Anahtarın
 * mülkteki yetkisi siteFullUser — Owner değil — ve Indexing API Owner şartı
 * aradığı için o API bu anahtarla zaten çalışmıyordu. Buradaki kapsam
 * salt okunur: sayı ister, hiçbir şey değiştirmez.
 *
 * JWT elle imzalanıyor; ek bağımlılık gerekmesin diye.
 *
 * Kullanım:  node scripts/search-console.js
 * Gerekli:   depo kökünde service-account.json (gitignore'da)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const KEY_PATH = path.join(__dirname, '..', 'service-account.json');
if (!fs.existsSync(KEY_PATH)) {
  console.error('service-account.json bulunamadı:', KEY_PATH);
  process.exit(1);
}
const KEY = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

const b64 = (o) =>
  Buffer.from(typeof o === 'string' ? o : JSON.stringify(o))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

async function token(scope) {
  const now = Math.floor(Date.now() / 1000);
  const claim = { iss: KEY.client_email, scope, aud: 'https://oauth2.googleapis.com/token', exp: now + 3600, iat: now };
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(claim)}`;
  const sig = crypto
    .createSign('RSA-SHA256')
    .update(unsigned)
    .sign(KEY.private_key)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${sig}`,
    }),
  });
  const j = await res.json();
  if (!j.access_token) throw new Error('token alınamadı: ' + JSON.stringify(j).slice(0, 200));
  return j.access_token;
}

const gun = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

(async () => {
  const t = await token('https://www.googleapis.com/auth/webmasters.readonly');
  const auth = { Authorization: `Bearer ${t}` };

  const sites = await (await fetch('https://searchconsole.googleapis.com/webmasters/v3/sites', { headers: auth })).json();
  if (sites.error) throw new Error('site listesi: ' + sites.error.message);
  console.log(
    'Erişilebilen mülkler:\n  ' +
      ((sites.siteEntry || []).map((s) => `${s.siteUrl} (${s.permissionLevel})`).join('\n  ') || '(yok)')
  );

  const target = (sites.siteEntry || []).find((s) => /infodaily/.test(s.siteUrl));
  if (!target) {
    console.log('\ninfodaily mülkü bu hesapta görünmüyor.');
    return;
  }

  const query = async (body) => {
    const r = await fetch(
      `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(target.siteUrl)}/searchAnalytics/query`,
      { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    );
    const j = await r.json();
    if (j.error) throw new Error(j.error.message);
    return j.rows || [];
  };

  for (const [ad, n] of [['Son 28 gün', 28], ['Son 90 gün', 90]]) {
    const [r] = await query({ startDate: gun(n), endDate: gun(1), dimensions: [], rowLimit: 1 });
    console.log(`\n${ad} (${gun(n)} → ${gun(1)})`);
    if (!r) {
      console.log('  veri yok');
      continue;
    }
    console.log(
      `  gösterim: ${r.impressions}  tıklanma: ${r.clicks}  CTR: %${(r.ctr * 100).toFixed(2)}  ort. sıra: ${r.position.toFixed(1)}`
    );
  }

  const sayfalar = await query({ startDate: gun(28), endDate: gun(1), dimensions: ['page'], rowLimit: 10 });
  console.log('\nEn çok gösterim alan sayfalar (28 gün):');
  sayfalar.forEach((r) =>
    console.log(
      `  ${String(r.impressions).padStart(6)} gös · ${String(r.clicks).padStart(4)} tık · ${r.keys[0].replace('https://www.infodaily.net', '') || '/'}`
    )
  );

  const sorgular = await query({ startDate: gun(28), endDate: gun(1), dimensions: ['query'], rowLimit: 10 });
  console.log('\nEn çok gösterim alan sorgular (28 gün):');
  if (!sorgular.length) console.log('  (yok)');
  sorgular.forEach((r) =>
    console.log(`  ${String(r.impressions).padStart(6)} gös · ${String(r.clicks).padStart(4)} tık · ${r.keys[0]}`)
  );

  const ulke = await query({ startDate: gun(28), endDate: gun(1), dimensions: ['country'], rowLimit: 5 });
  console.log('\nÜlke (28 gün):');
  ulke.forEach((r) => console.log(`  ${r.keys[0]}  ${r.impressions} gös · ${r.clicks} tık`));
})().catch((e) => {
  console.error('HATA:', e.message);
  process.exit(1);
});

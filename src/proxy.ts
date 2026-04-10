import { NextRequest, NextResponse } from 'next/server';

const COUNTRY_LANG: Record<string, string> = {
  // Turkish
  TR: 'tr',
  // German
  DE: 'de', AT: 'de', CH: 'de', LI: 'de', LU: 'de',
  // French
  FR: 'fr', BE: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr', ML: 'fr', BF: 'fr', NE: 'fr', TG: 'fr', BJ: 'fr', MG: 'fr', CD: 'fr', CG: 'fr', GA: 'fr', GN: 'fr',
  // Spanish
  ES: 'es', MX: 'es', AR: 'es', CO: 'es', CL: 'es', PE: 'es', VE: 'es', EC: 'es', BO: 'es', PY: 'es', UY: 'es', CR: 'es', PA: 'es', DO: 'es', HN: 'es', GT: 'es', SV: 'es', NI: 'es', CU: 'es',
  // Portuguese
  PT: 'pt', BR: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt',
  // Italian
  IT: 'it', SM: 'it', VA: 'it',
  // Russian
  RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru', TJ: 'ru',
  // Arabic
  SA: 'ar', AE: 'ar', EG: 'ar', IQ: 'ar', JO: 'ar', KW: 'ar', LB: 'ar', LY: 'ar', MA: 'ar', OM: 'ar', QA: 'ar', SD: 'ar', SY: 'ar', TN: 'ar', YE: 'ar', DZ: 'ar',
  // Chinese Simplified
  CN: 'zh-CN', SG: 'zh-CN',
  // Chinese Traditional
  TW: 'zh-TW', HK: 'zh-TW', MO: 'zh-TW',
  // Japanese
  JP: 'ja',
  // Korean
  KR: 'ko',
  // Hindi
  IN: 'hi',
  // Bengali
  BD: 'bn',
  // Indonesian
  ID: 'id',
  // Malay
  MY: 'ms',
  // Dutch
  NL: 'nl',
  // Polish
  PL: 'pl',
  // Swedish
  SE: 'sv',
  // Norwegian
  NO: 'no',
  // Danish
  DK: 'da',
  // Finnish
  FI: 'fi',
  // Czech
  CZ: 'cs',
  // Slovak
  SK: 'sk',
  // Romanian
  RO: 'ro',
  // Hungarian
  HU: 'hu',
  // Greek
  GR: 'el', CY: 'el',
  // Ukrainian
  UA: 'uk',
  // Vietnamese
  VN: 'vi',
  // Thai
  TH: 'th',
  // Persian
  IR: 'fa', AF: 'fa',
  // Hebrew
  IL: 'he',
  // Swahili
  KE: 'sw', TZ: 'sw', UG: 'sw',
  // Afrikaans
  ZA: 'af',
};

export function proxy(req: NextRequest) {
  const res = NextResponse.next();

  // Only set if user hasn't manually chosen a language
  const hasLangCookie = req.cookies.has('lang');
  if (hasLangCookie) return res;

  // Vercel provides country header automatically
  const country = req.headers.get('x-vercel-ip-country') ?? '';
  const lang = COUNTRY_LANG[country.toUpperCase()];

  if (lang) {
    res.cookies.set('lang', lang, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|favicon|robots|sitemap).*)'],
};

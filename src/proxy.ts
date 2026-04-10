import { NextRequest, NextResponse } from 'next/server';

const COUNTRY_LANG: Record<string, string> = {
  TR: 'tr', // Turkey
  DE: 'de', // Germany
  AT: 'de', // Austria
  CH: 'de', // Switzerland
  FR: 'fr', // France
  BE: 'fr', // Belgium
  ES: 'es', // Spain
  MX: 'es', // Mexico
  AR: 'es', // Argentina
  PT: 'pt', // Portugal
  BR: 'pt', // Brazil
  IT: 'it', // Italy
  JP: 'ja', // Japan
  SA: 'ar', // Saudi Arabia
  AE: 'ar', // UAE
  EG: 'ar', // Egypt
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

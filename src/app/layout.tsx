import type { Metadata } from 'next';
import { Archivo, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import FontProvider from '@/components/FontProvider';
import CookieBanner from '@/components/CookieBanner';
import BackToTop from '@/components/BackToTop';
import BottomNav from '@/components/BottomNav';
import { Analytics } from '@vercel/analytics/next';

/* design.md § Typography. Archivo değişken dosya olarak yükleniyor ve
   genişlik ekseni (wdth) de dahil: manşetler font-stretch: 75% ile aynı
   dosyadan sıkışık çiziliyor, ikinci bir "condensed" aile indirmeden.
   Source Serif 4'ün optik boyut ekseni metin boyutunda gövdeyi
   biraz kalınlaştırıp harf aralığını açıyor — uzun okumada fark ediyor. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-source-serif',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.infodaily.net'),
  title: {
    default: 'InfoDaily – Practical Guides, Tech & Daily Life',
    template: '%s | InfoDaily',
  },
  description: 'Practical technology and gaming guides: how to make the hardware and software you already own faster, safer, and longer-lived.',
  keywords: [
    'health tips', 'personal finance', 'technology news', 'life hacks', 'travel guide',
    'food recipes', 'business advice', 'science facts', 'relationship tips',
    'wellness', 'money saving', 'productivity', 'self improvement',
  ],
  authors: [{ name: 'InfoDaily Editorial Team', url: 'https://www.infodaily.net' }],
  creator: 'InfoDaily',
  publisher: 'InfoDaily',
  applicationName: 'InfoDaily',
  category: 'lifestyle',
  openGraph: {
    type: 'website',
    siteName: 'InfoDaily',
    locale: 'en_US',
    url: 'https://www.infodaily.net',
    title: 'InfoDaily – Practical Knowledge for Every Day',
    description: 'Practical technology and gaming guides for the devices you already own.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'InfoDaily – Knowledge for Every Day',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@infodaily',
    creator: '@infodaily',
    title: 'InfoDaily – Practical Knowledge for Every Day',
    description: 'Practical technology and gaming guides for the devices you already own.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'soUkwfns4jPrW0HEU8FPNe80U_FGTtSl9CG82LDQJMU',
    yandex: '79961fae532083c7',
  },
  alternates: {
    canonical: 'https://www.infodaily.net',
  },
};

const SITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.infodaily.net/#organization',
      name: 'InfoDaily',
      url: 'https://www.infodaily.net',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.infodaily.net/logo.svg',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'editorial',
        url: 'https://www.infodaily.net/contact',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.infodaily.net/#website',
      name: 'InfoDaily',
      url: 'https://www.infodaily.net',
      publisher: { '@id': 'https://www.infodaily.net/#organization' },
      inLanguage: 'en-US',
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  /* Font değişkenleri <html>'de, <body>'de değil: Tailwind --font-sans'ı
     :root'ta tanımlıyor ve var(--font-archivo)'yu orada çözüyor. Değişken
     body'de kalınca :root'ta boş, --font-sans geçersiz sayılıyor ve bütün
     site sistem fontuna düşüyordu. */
  return (
    <html lang="en" translate="no" className={`${archivo.variable} ${sourceSerif.variable}`} suppressHydrationWarning>
      <head suppressHydrationWarning>
        <meta name="google" content="notranslate" />
        <meta name="yandex-verification" content="79961fae532083c7" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="alternate" type="application/rss+xml" title="InfoDaily RSS Feed" href="https://www.infodaily.net/feed.xml" />
{/* Google Consent Mode v2 — denied by default until user accepts */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});` }} />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PD06ZLVSY6" />
        <script dangerouslySetInnerHTML={{ __html: `gtag('js',new Date());gtag('config','G-PD06ZLVSY6');` }} />
        {/* Restore consent if previously accepted */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('cookie_consent')==='accepted'){gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}})();` }} />
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3696555619228561" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_SCHEMA) }} />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            /* İlk boyamadan önce tema ve okuma yazı tipi. Liste eskiden dört
               temayla sınırlıydı: sunset, rose, midnight ya da sepia seçen
               okur her sayfa açılışında bir an açık temayı görüyordu. Rose ve
               sepia da açık tema olduğu hâlde `dark` sınıfı alıyordu. */
            __html: `(function(){try{var d=document.documentElement;var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var all=['light','dark','ocean','forest','sunset','rose','midnight','sepia'];var t=all.indexOf(s)>-1?s:p;d.setAttribute('data-theme',t);if(['dark','ocean','forest','sunset','midnight'].indexOf(t)>-1)d.classList.add('dark');var f=localStorage.getItem('reading_font');if(f==='sans')d.setAttribute('data-font','sans')}catch(e){}})()`,
          }}
        />
        <ThemeProvider>
          <FontProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <CookieBanner />
            <BackToTop />
            <BottomNav />
            <Footer />
          </FontProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

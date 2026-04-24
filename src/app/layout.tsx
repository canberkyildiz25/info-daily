import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter, Merriweather, Playfair_Display, Lora } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import FontProvider from '@/components/FontProvider';
import NotificationPrompt from '@/components/NotificationPrompt';
import SubscribePopup from '@/components/SubscribePopup';
import CookieBanner from '@/components/CookieBanner';
import BackToTop from '@/components/BackToTop';
import { Analytics } from '@vercel/analytics/next';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
});
const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lora',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.infodaily.net'),
  title: {
    default: 'InfoDaily – Health, Finance, Tech & Life Hacks',
    template: '%s | InfoDaily',
  },
  description: 'InfoDaily brings you expert-written articles on health, finance, technology, life hacks, travel, food, business, science, relationships, and entertainment to help you live smarter every day.',
  keywords: [
    'health tips', 'personal finance', 'technology news', 'life hacks', 'travel guide',
    'food recipes', 'business advice', 'science facts', 'relationship tips',
    'wellness', 'money saving', 'productivity', 'self improvement',
  ],
  authors: [{ name: 'InfoDaily Editorial Team', url: 'https://www.infodaily.net' }],
  creator: 'InfoDaily',
  publisher: 'InfoDaily',
  category: 'lifestyle',
  openGraph: {
    type: 'website',
    siteName: 'InfoDaily',
    locale: 'en_US',
    url: 'https://www.infodaily.net',
    title: 'InfoDaily – Knowledge for Every Day',
    description: 'Expert articles on health, finance, tech, life hacks, travel, food, business, science, and relationships.',
    images: [
      {
        url: '/og-image.png',
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
    title: 'InfoDaily – Knowledge for Every Day',
    description: 'Expert articles on health, finance, tech, life hacks, travel, food, business, science, and relationships.',
    images: ['/og-image.png'],
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
  alternates: {
    canonical: 'https://www.infodaily.net',
  },
  verification: {
    google: 'soUkwfns4jPrW0HEU8FPNe80U_FGTtSl9CG82LDQJMU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="alternate" type="application/rss+xml" title="InfoDaily RSS Feed" href="https://www.infodaily.net/feed.xml" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3696555619228561" crossOrigin="anonymous" />
        {/* Google Consent Mode v2 — denied by default until user accepts */}
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});` }} />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PD06ZLVSY6" />
        <script dangerouslySetInnerHTML={{ __html: `gtag('js',new Date());gtag('config','G-PD06ZLVSY6');` }} />
        {/* Restore consent if previously accepted */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(localStorage.getItem('cookie_consent')==='accepted'){gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});}}catch(e){}})();` }} />
      </head>
      <body className={`${jakarta.variable} ${inter.variable} ${merriweather.variable} ${playfair.variable} ${lora.variable} font-sans bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 antialiased`} suppressHydrationWarning>
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';var t=(['light','dark','ocean','forest'].includes(s)?s:p)||'light';document.documentElement.setAttribute('data-theme',t);if(t!=='light')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <ThemeProvider>
          <FontProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <NotificationPrompt />
            <SubscribePopup />
            <CookieBanner />
            <BackToTop />
            <Footer />
          </FontProvider>
        </ThemeProvider>
        <Analytics />
        {/* Google Translate */}
        <script dangerouslySetInnerHTML={{ __html: `function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:'en',autoDisplay:false},'google_translate_element');}` }} />
        <script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" async />
      </body>
    </html>
  );
}

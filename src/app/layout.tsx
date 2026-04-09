import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ThemeProvider from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.infodaily.net'),
  title: {
    default: 'InfoDaily – Health, Finance, Tech & Life Hacks',
    template: '%s | InfoDaily',
  },
  description: 'InfoDaily brings you expert-written articles on health, personal finance, technology, life hacks, and travel to help you live smarter every day.',
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
    google: '', // Google Search Console doğrulama kodu buraya
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('theme');var p=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';if((s||p)==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`,
          }}
        />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3696555619228561" crossOrigin="anonymous"></script>
      </head>
      <body className={`${inter.className} bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-100 antialiased`}>
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

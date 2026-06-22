import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // IF duplicate
      { source: '/health/the-beginners-guide-to-intermittent-fasting', destination: '/health/intermittent-fasting-for-beginners', permanent: true },
      // Sleep cluster
      { source: '/health/how-to-improve-your-sleep-quality-in-7-days', destination: '/health/how-to-fix-your-sleep-schedule-in-one-week', permanent: true },
      { source: '/health/why-you-wake-up-tired-even-after-8-hours-of-sleep', destination: '/health/why-you-are-always-tired-and-what-actually-fixes-it', permanent: true },
      // Headache
      { source: '/health/how-to-stop-headaches-naturally', destination: '/health/natural-remedies-for-headaches-that-actually-work', permanent: true },
      // Anti-inflammatory
      { source: '/health/the-best-anti-inflammatory-foods', destination: '/health/the-best-anti-inflammatory-foods-to-add-to-your-diet', permanent: true },
      // Finance
      { source: '/finance/passive-income-ideas-that-actually-work-in-2025', destination: '/finance/passive-income-ideas-that-actually-work-in-2026', permanent: true },
      { source: '/finance/7-passive-income-ideas-for-2025', destination: '/finance/passive-income-ideas-that-actually-work-in-2026', permanent: true },
      { source: '/finance/how-to-invest-1000-dollars-for-beginners', destination: '/finance/how-to-invest-your-first-1000-in-2026', permanent: true },
      { source: '/finance/how-to-create-a-monthly-budget-that-actually-works', destination: '/finance/how-to-create-a-monthly-budget-you-will-actually-stick-to', permanent: true },
      { source: '/finance/how-to-pay-off-debt-fast', destination: '/finance/best-ways-to-pay-off-debt-faster', permanent: true },
      { source: '/finance/best-high-yield-savings-accounts-in-2025', destination: '/finance/the-best-high-yield-savings-accounts-in-2026', permanent: true },
      // Technology
      { source: '/technology/how-to-speed-up-your-computer', destination: '/technology/how-to-speed-up-your-slow-computer-in-10-minutes', permanent: true },
      { source: '/technology/how-to-protect-your-privacy-online', destination: '/technology/how-to-protect-your-privacy-online-in-2026', permanent: true },
      { source: '/technology/best-password-managers-in-2025', destination: '/technology/best-password-managers-to-keep-your-accounts-safe', permanent: true },
      { source: '/technology/best-ai-tools-2025', destination: '/technology/best-ai-tools-for-everyday-life-2026', permanent: true },
      { source: '/technology/best-free-ai-tools-in-2025', destination: '/technology/the-best-free-ai-tools-you-should-be-using-right-now', permanent: true },
      // Business → Technology (AI jobs)
      { source: '/business/how-ai-is-changing-your-job', destination: '/technology/how-ai-is-changing-the-job-market-in-2026', permanent: true },
      { source: '/business/ai-and-job-displacement-in-2026-what-the-data-shows-about-automation-in-the-workplace', destination: '/technology/how-ai-is-changing-the-job-market-in-2026', permanent: true },
      // Life-hacks
      { source: '/life-hacks/how-to-wake-up-early-without-feeling-terrible', destination: '/life-hacks/how-to-wake-up-early-and-actually-feel-rested', permanent: true },
      { source: '/life-hacks/how-to-wake-up-early-and-actually-feel-good', destination: '/life-hacks/how-to-wake-up-early-and-actually-feel-rested', permanent: true },
      { source: '/life-hacks/how-to-learn-any-skill-twice-as-fast', destination: '/life-hacks/the-best-ways-to-learn-a-new-skill-faster', permanent: true },
      // Relationships
      { source: '/relationships/how-to-make-friends-as-an-adult', destination: '/relationships/how-to-make-new-friends-as-an-adult', permanent: true },
      // Science
      { source: '/science/why-you-dream-the-science-explained', destination: '/science/why-do-we-dream-and-what-do-our-dreams-mean', permanent: true },
      // Food
      { source: '/food/how-to-meal-prep-for-the-entire-week', destination: '/food/how-to-meal-prep-for-the-entire-week-in-2-hours', permanent: true },
      // Travel
      { source: '/travel/best-travel-insurance-options-explained', destination: '/travel/what-travel-insurance-actually-covers-and-when-you-need-it', permanent: true },
      { source: '/travel/cheapest-countries-to-visit-2025', destination: '/travel/the-best-countries-to-visit-on-a-budget', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: '**.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.katseye.world',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'deadline.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        pathname: '/**',
      },
      // News sources
      { protocol: 'https', hostname: 'media.guim.co.uk', pathname: '/**' },
      { protocol: 'https', hostname: 'i.guim.co.uk', pathname: '/**' },
      { protocol: 'https', hostname: '**.guim.co.uk', pathname: '/**' },
      { protocol: 'https', hostname: '**.bbc.co.uk', pathname: '/**' },
      { protocol: 'https', hostname: '**.bbc.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.reuters.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.cnn.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.nytimes.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.washingtonpost.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.theguardian.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.apnews.com', pathname: '/**' },
      { protocol: 'https', hostname: '**.axios.com', pathname: '/**' },
    ],
    unoptimized: true,
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
  // Eski adıyla kalan teknoloji yazıları
      { source: '/technology/how-to-speed-up-your-computer', destination: '/technology/how-to-speed-up-your-slow-computer-in-10-minutes', permanent: true },
      { source: '/technology/how-to-protect-your-privacy-online', destination: '/technology/how-to-protect-your-privacy-online-in-2026', permanent: true },
      { source: '/technology/best-password-managers-in-2025', destination: '/technology/best-password-managers-to-keep-your-accounts-safe', permanent: true },
      // İncelemesi yayımlanmış kaynaklardan yeniden yazıldı; eski slug elde test vaat ediyordu
      { source: '/technology/logitech-mobi-fold-review-is-this-ultra-compact-travel-mouse-worth-it', destination: '/technology/logitech-mobi-fold-what-the-specs-and-reviews-say', permanent: true },
      // Yayından kaldırıldı: yazı, hiç yapılmamış bir ilk elden testi anlatıyordu
      { source: '/technology/testing-apples-new-siri-ai-assistant-does-it-actually-work', destination: '/category/technology', permanent: true },
      // Beş ayrı "en iyi AI aracı" listesi tek bir yazıda birleşti
      { source: '/technology/best-ai-tools-2025', destination: '/technology/the-ai-tools-actually-worth-paying-for-in-2026', permanent: true },
      { source: '/technology/best-ai-tools-for-everyday-life-2026', destination: '/technology/the-ai-tools-actually-worth-paying-for-in-2026', permanent: true },
      { source: '/technology/best-free-ai-tools-in-2025', destination: '/technology/the-ai-tools-actually-worth-paying-for-in-2026', permanent: true },
      { source: '/technology/the-best-free-ai-tools-you-should-be-using-right-now', destination: '/technology/the-ai-tools-actually-worth-paying-for-in-2026', permanent: true },
      { source: '/technology/the-best-ai-tools-for-students-in-2026', destination: '/technology/the-ai-tools-actually-worth-paying-for-in-2026', permanent: true },
      // İş kategorisi kapandı; yapay zekâ ve istihdam yazısı teknolojide
      { source: '/business/how-ai-is-changing-your-job', destination: '/technology/how-ai-is-changing-the-job-market-in-2026', permanent: true },
      { source: '/business/ai-and-job-displacement-in-2026-what-the-data-shows-about-automation-in-the-workplace', destination: '/technology/how-ai-is-changing-the-job-market-in-2026', permanent: true },
      // Siri kümesi: yedi ayrı yazı vardı, biri kaldı
      { source: '/technology/apples-ai-moment-is-siri-finally-getting-the-upgrade-it-needs', destination: '/technology/what-is-apple-intelligence-everything-to-know-about-siris-revamp-at-wwdc-2026', permanent: true },
      { source: '/technology/apples-new-siri-ai-whats-changed-and-how-it-works-better', destination: '/technology/what-is-apple-intelligence-everything-to-know-about-siris-revamp-at-wwdc-2026', permanent: true },
      { source: '/technology/apples-new-siri-ai-update-whats-changed-and-how-to-use-it-on-your-mac', destination: '/technology/what-is-apple-intelligence-everything-to-know-about-siris-revamp-at-wwdc-2026', permanent: true },
      { source: '/technology/what-is-apples-new-siri-ai-which-devices-get-the-update-and-what-it-can-do', destination: '/technology/what-is-apple-intelligence-everything-to-know-about-siris-revamp-at-wwdc-2026', permanent: true },
      { source: '/technology/what-to-expect-from-wwdc-2026-new-ios-27-macos-27-and-ai-powered-siri', destination: '/technology/what-is-apple-intelligence-everything-to-know-about-siris-revamp-at-wwdc-2026', permanent: true },
      { source: '/technology/apple-intelligence-and-siri-revamp-what-to-expect-from-wwdc-2026', destination: '/technology/what-is-apple-intelligence-everything-to-know-about-siris-revamp-at-wwdc-2026', permanent: true },
      // Wi-Fi: iki yazı aynı soruyu soruyordu
      { source: '/technology/why-your-wi-fi-is-slower-than-you-pay-for-and-how-to-fix-it', destination: '/technology/how-to-speed-up-your-wi-fi-at-home', permanent: true },
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
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;

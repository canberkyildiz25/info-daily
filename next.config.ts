import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/health/the-beginners-guide-to-intermittent-fasting',
        destination: '/health/intermittent-fasting-for-beginners',
        permanent: true,
      },
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
    ],
    unoptimized: process.env.NEXT_PUBLIC_DISABLE_STATIC_OPTIMIZATION === 'true',
    minimumCacheTTL: 60,
    formats: ['image/webp', 'image/avif'],
  },
};

export default nextConfig;

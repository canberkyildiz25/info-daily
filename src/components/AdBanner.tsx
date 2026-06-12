'use client';
import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical' | 'fluid' | 'autorelaxed';
  className?: string;
}

// Replace with your actual AdSense Publisher ID
const ADSENSE_CLIENT = 'ca-pub-3696555619228561';

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  const isFluid = format === 'fluid';

  return (
    <div className={`adsense-container overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: isFluid ? 'center' : undefined }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-layout={isFluid ? 'in-article' : undefined}
        data-ad-format={format}
        data-full-width-responsive={isFluid ? undefined : 'true'}
      />
    </div>
  );
}

export function MultiplexAd() {
  return (
    <AdBanner
      slot="7889545600"
      format="autorelaxed"
    />
  );
}

export function InArticleAd() {
  return (
    <AdBanner
      slot="2054764996"
      format="fluid"
      className="in-article-ad"
    />
  );
}

export function SidebarAd() {
  return (
    <AdBanner
      slot="2054764996"
      format="auto"
      className="sidebar-ad"
    />
  );
}

// Placeholder shown before AdSense approval (remove after approval)
export function AdPlaceholder({ label = 'Advertisement', height = 90 }: { label?: string; height?: number }) {
  return (
    <div
      className="w-full bg-gray-100 border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs font-medium"
      style={{ minHeight: height }}
    >
      {label}
    </div>
  );
}

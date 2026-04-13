'use client';
import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
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

  return (
    <div className={`adsense-container overflow-hidden text-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
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

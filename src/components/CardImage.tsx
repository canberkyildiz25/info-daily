'use client';

import { useState } from 'react';
import Image from 'next/image';

function picsum(seed: string): string {
  const n = Math.abs(seed.split('').reduce((a, c) => a * 31 + c.charCodeAt(0), 0)) % 1000;
  return `https://picsum.photos/seed/${n}/800/450`;
}

interface CardImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  fallback?: React.ReactNode;
}

export default function CardImage({ src, alt, fill, sizes, priority, className }: CardImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      className={className}
      unoptimized
      onError={() => setImgSrc(picsum(alt))}
    />
  );
}

'use client';

import { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import Image from 'next/image';

interface ArticleHeroImageProps {
  src: string | null;
  alt: string;
  gradient: string;
  /* Emoji yerine kategori slug’i: ikonu bileşen kendi çiziyor. */
  categorySlug?: string;
  objectPosition?: string;
}

export default function ArticleHeroImage({ src, alt, gradient, categorySlug, objectPosition = 'center' }: ArticleHeroImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative rounded-2xl overflow-hidden h-64 sm:h-80 mb-8 bg-gray-100 dark:bg-slate-700">
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          preload
          sizes="(max-width: 1024px) 100vw, 66vw"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`bg-gradient-to-br ${gradient} h-full flex items-center justify-center`}>
          {categorySlug ? <CategoryIcon slug={categorySlug} size={84} className="text-white/60" /> : null}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}

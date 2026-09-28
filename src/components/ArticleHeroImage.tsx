'use client';

import { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import Image from 'next/image';

interface ArticleHeroImageProps {
  src: string | null;
  alt: string;
  tint: string;
  /* Emoji yerine kategori slug’i: ikonu bileşen kendi çiziyor. */
  categorySlug?: string;
  objectPosition?: string;
}

/* Kapak: okuma sütunundan geniş, sayfa kabının tamamı. Köşe yuvarlaması
   ve üstündeki karartma kaldırıldı — fotoğrafın üstünde metin yok, karartı
   yalnızca fotoğrafı soluklaştırıyordu. */
export default function ArticleHeroImage({ src, alt, tint, categorySlug, objectPosition = 'center' }: ArticleHeroImageProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9] overflow-hidden bg-[var(--bg-card-hover)]">
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          style={{ objectPosition }}
          preload
          sizes="(max-width: 1440px) 100vw, 1360px"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className={`${tint} h-full flex items-center justify-center`}>
          {categorySlug ? <CategoryIcon slug={categorySlug} size={84} className="text-white/60" /> : null}
        </div>
      )}
    </div>
  );
}

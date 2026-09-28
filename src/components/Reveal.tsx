'use client';
/* Kaydırınca bir kez beliren blok. Yalnızca anasayfada.
 *
 * Sunucu içeriği görünür gönderiyor; gizleme işi JS'e ait ve yalnızca
 * ekranın altında kalan bloklara uygulanıyor. Yani JS yüklenmezse ya da
 * geç yüklenirse hiçbir şey kaybolmuyor, ilk ekrandaki içerik de hiç
 * yanıp sönmüyor. Bir kez oynuyor: yukarı kaydırınca tekrar gizlenmiyor.
 * Stil: globals.css § Motion. */
import { useEffect, useRef, useState } from 'react';

export default function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /* Aynı sıradaki kardeşler arasında kademelendirme, ms. */
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<'idle' | 'pending' | 'visible'>('idle');

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    setState('pending');
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('visible');
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal={state}
      className={className}
      style={delay ? ({ '--reveal-delay': `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}

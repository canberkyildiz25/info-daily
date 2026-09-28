'use client';

import { useEffect, useRef } from 'react';

/* Okuma ilerlemesi: sayfanın en üstünde 2 piksellik vurgu çizgisi.
   Genişlik yerine transform: scaleX — genişlik her kaydırmada yerleşim
   hesaplatıyordu. React durumu da yok: her kaydırma olayı bileşeni
   yeniden çizdiriyordu, şimdi doğrudan elemanın stilini yazıyor. */
export default function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? Math.min(1, window.scrollY / docHeight) : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="fixed top-0 inset-x-0 z-[var(--z-overlay)] h-0.5 pointer-events-none">
      <div ref={bar} className="h-full origin-left bg-[var(--accent)]" style={{ transform: 'scaleX(0)' }} />
    </div>
  );
}

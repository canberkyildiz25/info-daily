import type { CSSProperties, ReactElement } from 'react';

/**
 * Kategori ikonları.
 *
 * Yerini aldığı şey emojiydi (🏥 💰 💻 …). Emoji bir ikon seti değil: her
 * platformda başka çizilir — Apple'da parlak ve üç boyutlu, Windows'ta düz,
 * Android'de bambaşka — yani sitenin görünümü okuyucunun işletim sistemine
 * göre değişir. Boyutları ve optik ağırlıkları da birbirini tutmaz, renkleri
 * temayla değişmez, `currentColor` almazlar.
 *
 * Bunlar tek bir ızgarada (24×24), tek çizgi kalınlığında (1.5) ve
 * `currentColor` ile çizilmiş; yani kategori rengi neyse ikon da onu alır.
 */

const PATHS: Record<string, ReactElement> = {
  // Sağlık — kalp atışı çizgisi
  health: (
    <path d="M3 12h3.5l2-5 3 10 2.5-7 1.5 2H21" />
  ),
  // Finans — madeni para üstü çizgi
  finance: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5a2.5 2.5 0 0 0-2.5-1.5c-1.4 0-2.5.7-2.5 2s1.1 1.7 2.5 2 2.5.7 2.5 2-1.1 2-2.5 2a2.5 2.5 0 0 1-2.5-1.5M12 6.5v11" />
    </>
  ),
  // Teknoloji — yonga
  technology: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3" />
    </>
  ),
  // Yaşam pratikleri — şimşek
  'life-hacks': (
    <path d="M13 3 5.5 13.5H11l-1 7.5 8-11H12l1-7Z" />
  ),
  // Seyahat — uçak
  travel: (
    <path d="M10.5 20.5 12 15l7.5-1.5a2 2 0 0 0 0-3.8L12 8 10.5 2.5 8.8 3.4 9.5 8.4 4 9.6l-1.6-2.2-1.3.7 1.7 3.4-1.7 3.4 1.3.7L4 13.4l5.5 1.2-.7 5 1.7.9Z" />
  ),
  // Yemek — çatal bıçak
  food: (
    <path d="M6 3v8a2 2 0 0 0 2 2h.5V21M8.5 3v6M6 3v6M17 3c-1.5 1.5-2 3.5-2 5.5 0 1.5.6 2.5 2 2.5V21" />
  ),
  // İş — evrak çantası
  business: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="2" />
      <path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3 12h18" />
    </>
  ),
  // Bilim — erlenmayer
  science: (
    <path d="M9.5 3v6.2L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3l-4.9-8.8V3M8 3h8M7.2 14h9.6" />
  ),
  // İlişkiler — iki halka
  relationships: (
    <>
      <circle cx="9" cy="12" r="5" />
      <circle cx="15" cy="12" r="5" />
    </>
  ),
  // Eğlence — film şeridi
  entertainment: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M7 5v14M17 5v14M2.5 9.5h4.5M2.5 14.5h4.5M17 9.5h4.5M17 14.5h4.5" />
    </>
  ),
  // Oyun — kumanda
  gaming: (
    <>
      <path d="M6.5 8h11a4.5 4.5 0 0 1 4.4 5.4l-.7 3.4A2.6 2.6 0 0 1 18.7 19c-1 0-1.6-.6-2.3-1.3L15.2 16.5H8.8L7.6 17.7C6.9 18.4 6.3 19 5.3 19a2.6 2.6 0 0 1-2.5-2.2l-.7-3.4A4.5 4.5 0 0 1 6.5 8Z" />
      <path d="M7.5 11v2.5M6.25 12.25h2.5M15.5 11.5h.01M17.5 13.5h.01" />
    </>
  ),
};

export interface CategoryIconProps {
  /** CATEGORIES içindeki slug. */
  slug: string;
  /** Kutu boyutu (px). Çizgi kalınlığı boyuta göre ölçeklenmez — kasıtlı:
      farklı boyutlardaki ikonlar aynı ağırlıkta görünsün. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function CategoryIcon({ slug, size = 20, className, style }: CategoryIconProps) {
  const d = PATHS[slug];
  if (!d) return null;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      /* Etiketin yanında duruyor, yani anlamı zaten yazıyor. Ekran
         okuyucuya ikinci kez söyletmenin faydası yok. */
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      {d}
    </svg>
  );
}

import type { CSSProperties, ReactElement } from 'react';

/**
 * Tema ikonları. Kategori ikonlarıyla aynı gerekçe ve aynı ızgara: emoji her
 * platformda başka çizilir ve `currentColor` almaz, yani seçili tema vurgusu
 * ikona geçmez.
 *
 * Sekiz tema soyut bir fikri temsil ediyor (aydınlık, karanlık, okyanus…), o
 * yüzden ikonlar resimsel değil işaretsel: her biri tek bir ayırt edici
 * siluet.
 */

const PATHS: Record<string, ReactElement> = {
  light: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </>
  ),
  dark: <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />,
  ocean: (
    <path d="M2.5 8.5c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6M2.5 13.5c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6M2.5 18.5c2 0 2-1.6 4-1.6s2 1.6 4 1.6 2-1.6 4-1.6 2 1.6 4 1.6" />
  ),
  forest: <path d="M12 2.5 6.5 11h3L5 18h14l-4.5-7h3L12 2.5ZM12 18v3.5" />,
  sunset: (
    <>
      <path d="M2.5 18h19M6 18a6 6 0 0 1 12 0" />
      <path d="M12 5v2.5M4.6 8.1l1.8 1.8M19.4 8.1l-1.8 1.8" />
    </>
  ),
  rose: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <path d="M12 9.8c0-2.6-1-4.3-2.4-4.3S7 7.2 7 9.8s1.4 2.2 2.8 2.2M14.2 12c2.6 0 4.3-1 4.3-2.4s-1.7-2.6-4.3-2.6-2.2 1.4-2.2 2.8M12 14.2c0 2.6 1 4.3 2.4 4.3s2.6-1.7 2.6-4.3-1.4-2.2-2.8-2.2M9.8 12c-2.6 0-4.3 1-4.3 2.4s1.7 2.6 4.3 2.6 2.2-1.4 2.2-2.8" />
    </>
  ),
  midnight: (
    <>
      <path d="M18.5 13.5A7 7 0 0 1 10 5a7.5 7.5 0 1 0 8.5 8.5Z" />
      <path d="M17.5 3.5v3M16 5h3" />
    </>
  ),
  sepia: (
    <>
      <path d="M5 4.5h10.5a2 2 0 0 1 2 2V19a2.5 2.5 0 0 1-2.5 2.5H6A2.5 2.5 0 0 1 3.5 19V6.5a2 2 0 0 1 2-2Z" />
      <path d="M7.5 9h7M7.5 12.5h7M7.5 16h4" />
    </>
  ),
};

export interface ThemeIconProps {
  id: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

export default function ThemeIcon({ id, size = 16, className, style }: ThemeIconProps) {
  const d = PATHS[id];
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
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ flexShrink: 0, ...style }}
    >
      {d}
    </svg>
  );
}

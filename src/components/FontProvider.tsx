'use client';
import { createContext, useContext, useEffect, useState } from 'react';

/* Okuma yazı tipi. Yalnızca makale gövdesini değiştiriyor (.reading) —
   eskiden body'nin fontFamily'sini satır içi eziyordu, yani okur serif
   seçince menüler, düğmeler ve etiketler de serife dönüyordu. Seçim
   kaydedilmiyordu da: her sayfa açılışında varsayılana dönüyordu.

   Varsayılan serif, çünkü uzun metin için seçilen yüz o (design.md). */
export type FontId = 'serif' | 'sans';

export const FONTS: { id: FontId; label: string; variable: string; serif: boolean }[] = [
  { id: 'serif', label: 'Source Serif', variable: '--font-source-serif', serif: true  },
  { id: 'sans',  label: 'Archivo',      variable: '--font-archivo',      serif: false },
];

const STORAGE_KEY = 'reading_font';

interface FontCtx { font: FontId; setFont: (f: FontId) => void; }
const FontContext = createContext<FontCtx>({ font: 'serif', setFont: () => {} });
export function useFont() { return useContext(FontContext); }

function applyFont(font: FontId) {
  const html = document.documentElement;
  if (font === 'sans') html.setAttribute('data-font', 'sans');
  else html.removeAttribute('data-font');
}

export default function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontId>('serif');

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch {}
    if (stored === 'sans') setFontState('sans');
  }, []);

  useEffect(() => {
    applyFont(font);
  }, [font]);

  const setFont = (f: FontId) => {
    setFontState(f);
    try { localStorage.setItem(STORAGE_KEY, f); } catch {}
  };

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

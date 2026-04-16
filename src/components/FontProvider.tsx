'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type FontId = 'jakarta' | 'inter' | 'merriweather' | 'playfair' | 'lora';

export const FONTS: { id: FontId; label: string; variable: string; serif: boolean }[] = [
  { id: 'jakarta',     label: 'Jakarta',     variable: '--font-jakarta',     serif: false },
  { id: 'inter',       label: 'Inter',       variable: '--font-inter',       serif: false },
  { id: 'merriweather',label: 'Merriweather',variable: '--font-merriweather',serif: true  },
  { id: 'playfair',    label: 'Playfair',    variable: '--font-playfair',    serif: true  },
  { id: 'lora',        label: 'Lora',        variable: '--font-lora',        serif: true  },
];

interface FontCtx { font: FontId; setFont: (f: FontId) => void; }
const FontContext = createContext<FontCtx>({ font: 'jakarta', setFont: () => {} });
export function useFont() { return useContext(FontContext); }

function applyFont(font: FontId) {
  const f = FONTS.find(f => f.id === font) ?? FONTS[0];
  document.documentElement.setAttribute('data-font', font);
  document.body.style.fontFamily = `var(${f.variable}), ${f.serif ? 'Georgia, serif' : 'ui-sans-serif, system-ui, sans-serif'}`;
}

export default function FontProvider({ children }: { children: React.ReactNode }) {
  const [font, setFontState] = useState<FontId>('jakarta');

  useEffect(() => {
    const stored = localStorage.getItem('font') as FontId | null;
    const valid = FONTS.map(f => f.id);
    const resolved: FontId = stored && valid.includes(stored) ? stored : 'jakarta';
    setFontState(resolved);
    applyFont(resolved);
  }, []);

  const setFont = (f: FontId) => {
    setFontState(f);
    localStorage.setItem('font', f);
    applyFont(f);
  };

  return (
    <FontContext.Provider value={{ font, setFont }}>
      {children}
    </FontContext.Provider>
  );
}

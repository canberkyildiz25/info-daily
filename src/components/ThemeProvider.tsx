'use client';
import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset' | 'rose' | 'midnight' | 'sepia';

export const THEMES: { id: Theme; label: string; icon: string; dark: boolean }[] = [
  { id: 'light',    label: 'Light',    icon: '☀️',  dark: false },
  { id: 'dark',     label: 'Dark',     icon: '🌙',  dark: true  },
  { id: 'ocean',    label: 'Ocean',    icon: '🌊',  dark: true  },
  { id: 'forest',   label: 'Forest',   icon: '🌲',  dark: true  },
  { id: 'sunset',   label: 'Sunset',   icon: '🌅',  dark: true  },
  { id: 'rose',     label: 'Rose',     icon: '🌸',  dark: false },
  { id: 'midnight', label: 'Midnight', icon: '🔮',  dark: true  },
  { id: 'sepia',    label: 'Sepia',    icon: '📜',  dark: false },
];

interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; }
const ThemeContext = createContext<ThemeCtx>({ theme: 'light', setTheme: () => {} });
export function useTheme() { return useContext(ThemeContext); }

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  const isDark = THEMES.find(t => t.id === theme)?.dark ?? false;
  html.classList.toggle('dark', isDark);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    const validThemes = THEMES.map(t => t.id);
    // Auto-detect system preference if no stored theme
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved: Theme = stored && validThemes.includes(stored)
      ? stored
      : systemDark ? 'dark' : 'light';
    setThemeState(resolved);
    applyTheme(resolved);

    // Listen for system theme changes (only if no user preference stored)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        const next: Theme = e.matches ? 'dark' : 'light';
        setThemeState(next);
        applyTheme(next);
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
    applyTheme(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Theme provider for consistent theming across the app
 */

import React, {createContext, useContext, useState, useCallback, useMemo} from 'react';
import type {ReaderTheme} from '@types/index';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  accent: string;
  border: string;
  foreignWord: string;
  foreignWordBg: string;
  error: string;
  success: string;
}

interface Theme {
  colors: ThemeColors;
  isDark: boolean;
  readerTheme: ReaderTheme;
}

const lightTheme: Theme = {
  isDark: false,
  readerTheme: 'light',
  colors: {
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1f2937',
    textSecondary: '#6b7280',
    primary: '#0ea5e9',
    primaryLight: '#e0f2fe',
    accent: '#8b5cf6',
    border: '#e5e7eb',
    foreignWord: '#6366f1',
    foreignWordBg: '#eef2ff',
    error: '#ef4444',
    success: '#22c55e',
  },
};

const darkTheme: Theme = {
  isDark: true,
  readerTheme: 'dark',
  colors: {
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    primary: '#38bdf8',
    primaryLight: '#0c4a6e',
    accent: '#a78bfa',
    border: '#334155',
    foreignWord: '#818cf8',
    foreignWordBg: '#312e81',
    error: '#f87171',
    success: '#4ade80',
  },
};

const sepiaTheme: Theme = {
  isDark: false,
  readerTheme: 'sepia',
  colors: {
    background: '#f4ecd8',
    surface: '#ebe3d0',
    text: '#5c4b37',
    textSecondary: '#8b7355',
    primary: '#b8860b',
    primaryLight: '#f5e6c8',
    accent: '#8b4513',
    border: '#d4c4a8',
    foreignWord: '#8b4513',
    foreignWordBg: '#f5e6c8',
    error: '#b91c1c',
    success: '#15803d',
  },
};

interface ThemeContextValue {
  theme: Theme;
  setReaderTheme: (theme: ReaderTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({children}: ThemeProviderProps): React.JSX.Element {
  const [readerTheme, setReaderThemeState] = useState<ReaderTheme>('light');

  const setReaderTheme = useCallback((newTheme: ReaderTheme) => {
    setReaderThemeState(newTheme);
  }, []);

  const theme = useMemo(() => {
    switch (readerTheme) {
      case 'dark':
        return darkTheme;
      case 'sepia':
        return sepiaTheme;
      default:
        return lightTheme;
    }
  }, [readerTheme]);

  const value = useMemo(
    () => ({
      theme,
      setReaderTheme,
    }),
    [theme, setReaderTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

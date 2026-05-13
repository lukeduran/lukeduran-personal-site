'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SiteMode } from './types';

interface ModeContextType {
  mode: SiteMode;
  setMode: (mode: SiteMode) => void;
}

// Default mode for SSG
const defaultMode: SiteMode = 'professional';

const ModeContext = createContext<ModeContextType>({
  mode: defaultMode,
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<SiteMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check URL params first
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode') as SiteMode | null;
      
      if (urlMode === 'professional' || urlMode === 'personal') {
        setModeState(urlMode);
        localStorage.setItem('siteMode', urlMode);
      } else {
        // Then check localStorage
        const stored = localStorage.getItem('siteMode') as SiteMode | null;
        if (stored === 'professional' || stored === 'personal') {
          setModeState(stored);
        }
      }
    }
  }, []);

  const setMode = (newMode: SiteMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteMode', newMode);
      // Update URL without reload
      const url = new URL(window.location.href);
      url.searchParams.set('mode', newMode);
      window.history.replaceState({}, '', url.toString());
    }
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}

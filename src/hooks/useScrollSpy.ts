'use client';

import { useEffect, useState } from 'react';

const getScrollTop = () =>
  typeof window === 'undefined' ? 0 : window.scrollY || document.documentElement.scrollTop;

/**
 * Returns the id of the section currently in view (scroll spy).
 * Uses the top third of the viewport as the "active" zone.
 */
export function useScrollSpy(sectionIds: string[], options?: { offset?: number }) {
  const [activeId, setActiveId] = useState<string | null>(sectionIds[0] ?? null);
  const offset = options?.offset ?? 120;

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = getScrollTop();
      const viewportThird =
        scrollTop + (typeof window !== 'undefined' ? window.innerHeight : 0) / 3;

      let current: string | null = null;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const top = el.getBoundingClientRect().top + scrollTop - offset;
          if (viewportThird >= top) {
            current = sectionIds[i];
            break;
          }
        }
      }
      setActiveId(current ?? sectionIds[0] ?? null);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds.join(','), offset]);

  return activeId;
}

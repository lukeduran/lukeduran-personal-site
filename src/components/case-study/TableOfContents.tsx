'use client';

import { useState, useEffect } from 'react';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { ChevronDown } from 'lucide-react';

export interface TocItem {
  id: string;
  label: string;
}

type TocVariant = 'sidebar' | 'inline';

interface TableOfContentsProps {
  items: TocItem[];
  variant?: TocVariant;
  className?: string;
}

export default function TableOfContents({
  items,
  variant = 'sidebar',
  className = '',
}: TableOfContentsProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeId = useScrollSpy(items.map((i) => i.id));

  // Close mobile TOC when clicking a link (after scroll)
  useEffect(() => {
    if (!mobileOpen) return;
    const handleScroll = () => setMobileOpen(false);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  if (items.length === 0) return null;

  const linkClass = (isActive: boolean) =>
    isActive
      ? 'font-medium text-foreground bg-muted'
      : 'text-foreground/60 hover:text-foreground hover:bg-muted/50';

  const navVertical = (
    <nav aria-label="Case study contents" className="space-y-1">
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={() => setMobileOpen(false)}
            className={`block rounded-md py-2 px-3 text-sm transition-colors ${linkClass(isActive)}`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  const navHorizontal = (
    <nav
      aria-label="Case study contents"
      className="flex flex-wrap items-center gap-1 border-b border-border pb-4"
    >
      <span className="mr-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
        On this page
      </span>
      {items.map((item) => {
        const isActive = activeId === item.id;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`rounded-md py-1.5 px-3 text-sm transition-colors ${linkClass(isActive)}`}
          >
            {item.label}
          </a>
        );
      })}
    </nav>
  );

  return (
    <div className={className}>
      {/* Desktop: inline = horizontal bar; sidebar = sticky vertical */}
      {variant === 'inline' ? (
        <div className="hidden lg:block sticky top-20 z-10 -mx-4 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          {navHorizontal}
        </div>
      ) : (
        <div className="hidden lg:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
            On this page
          </p>
          {navVertical}
        </div>
      )}

      {/* Mobile: collapsible (same for both variants) */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-lg border border-border bg-muted/30 py-3 px-4 text-left text-sm font-medium text-foreground"
          aria-expanded={mobileOpen}
          aria-controls="case-study-toc-mobile"
          id="case-study-toc-toggle"
        >
          <span>Jump to section</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        <div
          id="case-study-toc-mobile"
          role="region"
          aria-labelledby="case-study-toc-toggle"
          className={`overflow-hidden transition-all duration-200 ${
            mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-x border-b border-border bg-background py-3 px-4">
            {navVertical}
          </div>
        </div>
      </div>
    </div>
  );
}

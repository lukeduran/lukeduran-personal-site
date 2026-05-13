'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getSiteContent } from '@/lib/content';
import { useMode } from '@/lib/mode-context';
import MobileMenu from './MobileMenu';
import ModeToggle from './ModeToggle';

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const content = getSiteContent();
  const { mode } = useMode();
  const modeContent = content[mode];
  
  const navItems = [
    { label: 'About', href: '/portfolio#about' },
    { label: 'Experience', href: '/portfolio#experience' },
    ...(content.sections.showProjects ? [{ label: 'Projects', href: '/portfolio#projects' }] : []),
    { label: 'Skills', href: '/portfolio#skills' },
    ...(content.sections.showEducation ? [{ label: 'Education', href: '/portfolio#education' }] : []),
    { label: 'Contact', href: '/portfolio#contact' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/portfolio"
              className="text-base font-semibold text-foreground transition-colors hover:text-accent sm:text-lg"
            >
              {modeContent.hero.name}
            </Link>
            <div className="flex items-center gap-3">
              <ModeToggle />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="rounded-lg p-2 text-foreground/70 transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px] min-w-[44px] touch-manipulation"
                aria-label="Open menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navItems={navItems} />
    </>
  );
}

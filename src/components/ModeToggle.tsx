'use client';

import { useMode } from '@/lib/mode-context';

export default function ModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-1">
      <button
        onClick={() => setMode('professional')}
        className={`relative flex w-24 items-center justify-center rounded-md py-2 text-xs font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent min-h-[36px] touch-manipulation ${
          mode === 'professional'
            ? 'bg-accent text-white shadow-sm'
            : 'text-foreground/60 hover:text-foreground/80'
        }`}
        aria-label="Switch to Professional mode"
        aria-pressed={mode === 'professional'}
      >
        Professional
      </button>
      <button
        onClick={() => setMode('personal')}
        className={`relative flex w-24 items-center justify-center rounded-md py-2 text-xs font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accent min-h-[36px] touch-manipulation ${
          mode === 'personal'
            ? 'bg-accent text-white shadow-sm'
            : 'text-foreground/60 hover:text-foreground/80'
        }`}
        aria-label="Switch to Personal mode"
        aria-pressed={mode === 'personal'}
      >
        Personal
      </button>
    </div>
  );
}

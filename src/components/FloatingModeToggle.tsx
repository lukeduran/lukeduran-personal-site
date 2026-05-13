'use client';

import { motion } from 'framer-motion';
import { useMode } from '@/lib/mode-context';

export default function FloatingModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-50"
    >
      <div className="flex items-center rounded-full border border-border bg-background/90 p-1 shadow-lg backdrop-blur-md">
        <button
          onClick={() => setMode('professional')}
          className={`relative rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
            mode === 'professional'
              ? 'bg-accent text-white shadow-sm'
              : 'text-foreground/50 hover:text-foreground/80'
          }`}
          aria-pressed={mode === 'professional'}
        >
          Professional
        </button>
        <button
          onClick={() => setMode('personal')}
          className={`relative rounded-full px-5 py-2 text-xs font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 ${
            mode === 'personal'
              ? 'bg-accent text-white shadow-sm'
              : 'text-foreground/50 hover:text-foreground/80'
          }`}
          aria-pressed={mode === 'personal'}
        >
          Personal
        </button>
      </div>
    </motion.div>
  );
}

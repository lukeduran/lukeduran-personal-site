'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ScrollCue() {
  return (
    <div className="relative z-50 mt-12 flex justify-center overflow-visible">
      <Link
        href="#about"
        className="group relative z-50 flex flex-col items-center gap-2 text-foreground/40 transition-colors hover:text-foreground/60 overflow-visible"
        aria-label="Scroll to About section"
      >
        <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative z-50 overflow-visible"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-50 overflow-visible"
            style={{ willChange: 'transform' }}
          >
            <svg
              className="h-6 w-6 relative z-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        </motion.div>
      </Link>
    </div>
  );
}

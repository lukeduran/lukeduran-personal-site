'use client';

import { motion } from 'framer-motion';

interface CurrentlyProps {
  text: string;
}

export default function Currently({ text }: CurrentlyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative mt-4 sm:mt-6 rounded-lg border-l-2 border-accent/40 bg-muted/30 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5 md:py-4"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-accent/80 sm:text-sm">
          Currently
        </span>
        <p className="flex-1 text-sm leading-relaxed text-foreground/70 sm:text-base">
          {text}
        </p>
      </div>
    </motion.div>
  );
}

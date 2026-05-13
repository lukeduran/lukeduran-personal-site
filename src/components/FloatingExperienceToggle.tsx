'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, LayoutTemplate } from 'lucide-react';

export default function FloatingExperienceToggle() {
  const pathname = usePathname();

  if (pathname === '/') return null;

  const isChat = pathname.startsWith('/chat');
  const href = isChat ? '/portfolio' : '/chat';
  const label = isChat ? 'Portfolio' : 'Chat with me';
  const Icon = isChat ? LayoutTemplate : MessageCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href={href}
        className="flex items-center gap-2 rounded-full border border-border bg-background/90 px-5 py-2.5 text-xs font-medium text-foreground/70 shadow-lg backdrop-blur-md transition-all hover:border-accent/40 hover:text-accent"
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </Link>
    </motion.div>
  );
}

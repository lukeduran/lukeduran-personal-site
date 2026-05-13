'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { getSiteContent } from '@/lib/content';
import { MessageSquare, LayoutTemplate } from 'lucide-react';

const content = getSiteContent();
const { name, role } = content.professional.hero;

const cards = [
  {
    href: '/chat',
    icon: MessageSquare,
    label: 'AI Experience',
    description: 'Ask me anything — career, projects, how I think about product.',
  },
  {
    href: '/portfolio',
    icon: LayoutTemplate,
    label: 'Portfolio',
    description: 'Browse experience, projects, and case studies at your own pace.',
  },
];

export default function ChoiceScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center px-4 py-16">

      {/* Animated gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-float-1 absolute left-[15%] top-[20%] h-[480px] w-[480px] rounded-full bg-accent/45 blur-3xl" />
        <div className="animate-float-2 absolute bottom-[15%] right-[10%] h-[400px] w-[400px] rounded-full bg-accent/35 blur-3xl" />
        <div className="animate-float-3 absolute right-[35%] top-[55%] h-[280px] w-[280px] rounded-full bg-accent/25 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          {name}
        </motion.h1>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-3 text-xl font-semibold text-foreground/80 sm:text-2xl"
        >
          {role}
        </motion.p>

        {/* Cards */}
        <div className="mt-14 grid w-full gap-4 sm:grid-cols-2">
          {cards.map((card, idx) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={card.href}
                className="group flex flex-col items-start gap-4 rounded-2xl border border-accent/20 bg-background/80 p-6 text-left shadow-sm backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/50 hover:shadow-lg"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/15">
                  <card.icon className="h-5 w-5 text-accent" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="mb-1.5 text-base font-semibold text-foreground">
                    {card.label}
                  </h2>
                  <p className="text-sm leading-relaxed text-foreground/55">
                    {card.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-xs text-foreground/30"
        >
          You can switch between experiences at any time.
        </motion.p>
      </div>
    </div>
  );
}

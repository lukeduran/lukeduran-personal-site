'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Container from './Container';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  alternate?: boolean;
}

export default function Section({ id, children, className = '', alternate = false }: SectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative py-12 sm:py-16 md:py-24 lg:py-32 ${alternate ? 'bg-muted-alt' : ''} ${className}`}
    >
      <Container>{children}</Container>
    </motion.section>
  );
}

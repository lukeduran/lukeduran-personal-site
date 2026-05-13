'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExperienceItem } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Tag from './Tag';
import TechTag from './TechTag';

interface TimelineItemProps {
  experience: ExperienceItem;
  isLast?: boolean;
  index: number;
}

export default function TimelineItem({ experience, isLast = false, index }: TimelineItemProps) {
  const hasMultipleRoles = experience.roles.length > 1;
  // Default to the most recent role (last in array)
  const [activeRoleIdx, setActiveRoleIdx] = useState(Math.max(0, experience.roles.length - 1));
  const activeRole = experience.roles[activeRoleIdx];

  if (!activeRole) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative pb-6 last:pb-0"
    >
      {/* Vertical connector — desktop only */}
      {!isLast && (
        <div className="absolute hidden sm:block left-6 top-12 h-full w-0.5 bg-accent/30" />
      )}
      <div className="relative flex gap-6">

        {/* Logo sidebar — desktop only */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{
            duration: 0.4,
            delay: index * 0.15 + 0.1,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative z-10 hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm"
        >
          {experience.logo ? (
            <Image
              src={experience.logo}
              alt={`${experience.company} logo`}
              width={48}
              height={48}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted/50">
              <span className="text-xs font-medium text-foreground/40">
                {experience.company.charAt(0)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          whileHover={{ y: -2 }}
          transition={{
            duration: 0.5,
            delay: index * 0.15 + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex-1 rounded-xl border border-border bg-background p-4 sm:p-6 transition-all group-hover:border-accent/20 group-hover:shadow-lg"
        >
          {/* Company Header */}
          <div className="mb-4 sm:mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                {/* Logo inline on mobile */}
                <div className="flex sm:hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background shadow-sm">
                  {experience.logo ? (
                    <Image
                      src={experience.logo}
                      alt={`${experience.company} logo`}
                      width={36}
                      height={36}
                      className="h-full w-full object-contain p-1.5"
                    />
                  ) : (
                    <span className="text-xs font-medium text-foreground/40">
                      {experience.company.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-foreground font-display">
                  {experience.company}
                </h3>
              </div>
              {experience.location && (
                <p className="mt-1 text-sm font-medium text-foreground/70">
                  {experience.location}
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:mt-0 sm:justify-end">
              <p className="text-xs sm:text-sm font-medium text-foreground/50 whitespace-nowrap">
                {experience.start} — {experience.end}
              </p>
              {experience.industry && (
                <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-foreground/70">
                  {experience.industry}
                </span>
              )}
            </div>
          </div>

          {/* Role tabs — only shown when multiple roles */}
          {hasMultipleRoles && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {experience.roles.map((role, idx) => (
                <div key={`${role.title}-${role.start}`} className="flex items-center gap-1.5">
                  <button
                    onClick={() => setActiveRoleIdx(idx)}
                    className={`relative rounded-full px-3 py-1 text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                      activeRoleIdx === idx
                        ? 'bg-accent text-white'
                        : 'border border-border text-foreground/50 hover:border-accent/40 hover:text-foreground/80'
                    }`}
                  >
                    {role.title}
                  </button>
                  {idx < experience.roles.length - 1 && (
                    <ChevronRight className="h-3 w-3 shrink-0 text-foreground/25" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Active role content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoleIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {/* Date (only for single-role companies, multi-role uses tabs) */}
              {!hasMultipleRoles && (
                <div className="mb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <h4 className="text-base sm:text-lg font-semibold text-foreground">
                    {activeRole.title}
                  </h4>
                  <p className="text-xs font-medium text-foreground/50 whitespace-nowrap">
                    {activeRole.start} — {activeRole.end}
                  </p>
                </div>
              )}

              {/* Date range under tabs for multi-role */}
              {hasMultipleRoles && (
                <p className="mb-3 text-xs font-medium text-foreground/40">
                  {activeRole.start} — {activeRole.end}
                </p>
              )}

              {activeRole.impact && (
                <p className="mb-3 text-sm font-medium leading-relaxed text-foreground/80">
                  {activeRole.impact}
                </p>
              )}

              {activeRole.highlights && activeRole.highlights.length > 0 && (
                <ul className="space-y-2 list-disc pl-5 text-sm leading-relaxed text-foreground/70">
                  {activeRole.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Domains & Tech */}
          {(experience.domains?.length || experience.tech?.length) ? (
            <div className="mt-6 space-y-3 border-t border-border pt-4">
              {experience.domains && experience.domains.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Product
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experience.domains.map((domain) => (
                      <Tag key={domain}>{domain}</Tag>
                    ))}
                  </div>
                </div>
              )}
              {experience.tech && experience.tech.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Tech
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {experience.tech.map((tech) => (
                      <TechTag
                        key={typeof tech === 'string' ? tech : tech.name}
                        item={tech}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
}

'use client';

import { ReactNode } from 'react';

interface CaseStudySectionProps {
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export default function CaseStudySection({
  id,
  title,
  subtitle,
  children,
  className = '',
}: CaseStudySectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-28 pt-6 first:pt-0 ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="mb-1.5 text-xl font-semibold tracking-tight text-foreground font-display sm:text-2xl"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mb-4 text-sm text-foreground/60">
          {subtitle}
        </p>
      )}
      <div className="space-y-5 text-foreground/85 [&>p]:leading-relaxed [&>ul]:ml-5 [&>ul]:list-disc [&>ul]:space-y-2 [&>ul]:leading-relaxed">
        {children}
      </div>
    </section>
  );
}

'use client';

import { ReactNode } from 'react';

type CalloutVariant = 'decision' | 'tradeoff' | 'impact';

const variants: Record<
  CalloutVariant,
  { label: string; className: string }
> = {
  decision: {
    label: 'Key Decision',
    className:
      'border-l-4 border-foreground/80 bg-foreground/[0.04]',
  },
  tradeoff: {
    label: 'Tradeoff',
    className:
      'border-l-4 border-amber-500/70 bg-amber-500/5',
  },
  impact: {
    label: 'Impact',
    className:
      'border-l-4 border-emerald-600/70 bg-emerald-500/5',
  },
};

interface CalloutProps {
  variant: CalloutVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Callout({
  variant,
  title,
  children,
  className = '',
}: CalloutProps) {
  const { label, className: variantClass } = variants[variant];
  const displayTitle = title ?? label;

  return (
    <aside
      className={`my-6 rounded-r-md py-4 pl-4 pr-5 ${variantClass} ${className}`}
      role="complementary"
      aria-label={displayTitle}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">
        {displayTitle}
      </p>
      <div className="text-sm leading-relaxed text-foreground/85 [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:ml-4 [&>ul]:list-disc [&>ul]:space-y-1">
        {children}
      </div>
    </aside>
  );
}

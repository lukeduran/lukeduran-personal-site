'use client';

import Image from 'next/image';
import {
  siReact,
  siNodedotjs,
  siPostgresql,
  siDocker,
  siPython,
  siKubernetes,
  siGraphql,
  siTypescript,
  siFirebase,
  siWindsurf,
} from 'simple-icons';
import type { SimpleIcon } from 'simple-icons';
import type { TechItem } from '@/lib/types';
import { getTechName, getTechIconUrl } from '@/lib/tech';

const TECH_ICONS: Record<string, SimpleIcon> = {
  React: siReact,
  'React Native': siReact,
  'Node.js': siNodedotjs,
  PostgreSQL: siPostgresql,
  Docker: siDocker,
  Python: siPython,
  Kubernetes: siKubernetes,
  GraphQL: siGraphql,
  TypeScript: siTypescript,
  Firebase: siFirebase,
  Windsurf: siWindsurf,
};

interface TechTagProps {
  item: TechItem;
  className?: string;
}

export default function TechTag({ item, className = '' }: TechTagProps) {
  const name = getTechName(item);
  const customIconUrl = getTechIconUrl(item);
  const libraryIcon = TECH_ICONS[name];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground/70 ${className}`}
    >
      {customIconUrl ? (
        <span className="relative size-3.5 shrink-0" aria-hidden>
          <Image
            src={customIconUrl}
            alt=""
            width={14}
            height={14}
            className="object-contain"
          />
        </span>
      ) : libraryIcon ? (
        <span
          className="shrink-0 [&>svg]:size-3.5"
          style={{ color: libraryIcon.hex ? `#${libraryIcon.hex}` : 'currentColor' }}
          aria-hidden
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d={libraryIcon.path} />
          </svg>
        </span>
      ) : null}
      <span>{name}</span>
    </span>
  );
}

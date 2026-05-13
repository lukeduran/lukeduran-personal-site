'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Project } from '@/lib/types';
import { getTechName } from '@/lib/tech';
import Tag from './Tag';
import TechTag from './TechTag';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/portfolio/projects/${project.slug}`}
        className="group relative flex h-[380px] flex-col overflow-hidden rounded-xl border border-border bg-background transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/20 via-accent/10 to-transparent transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-accent/0 transition-all duration-300 group-hover:ring-accent/10" />
        <ArrowUpRight className="absolute right-4 top-4 z-10 h-4 w-4 text-foreground/0 transition-all duration-200 group-hover:text-foreground/40" />
        
        {project.heroImage ? (
          <div className="relative h-48 shrink-0 w-full overflow-hidden bg-muted">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover grayscale-[40%] transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60" />
          </div>
        ) : (
          <div className="relative h-48 shrink-0 w-full overflow-hidden bg-gradient-to-br from-muted via-muted-alt to-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-2 text-4xl opacity-20">📐</div>
                <p className="text-xs font-medium text-foreground/30">Project Preview</p>
              </div>
            </div>
          </div>
        )}
        
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6"
        >
          <h3 className="mb-1.5 line-clamp-2 text-lg sm:text-xl font-semibold text-foreground font-display group-hover:text-foreground/90">
            {project.title}
          </h3>
          <p className="mb-1.5 line-clamp-1 text-xs sm:text-sm font-medium text-foreground/60">
            {project.tagline}
          </p>
          <p className="mb-2 sm:mb-3 line-clamp-3 min-h-0 flex-1 text-xs sm:text-sm leading-relaxed text-foreground/70">
            {project.summary}
          </p>
          <div className="flex h-[4.5rem] shrink-0 flex-wrap gap-2 overflow-hidden">
            {project.stack.length > 5 ? (
              <>
                {project.stack.slice(0, 5).map((tech) => (
                  <TechTag key={getTechName(tech)} item={tech} />
                ))}
                <Tag>{`${project.stack.length - 5} more`}</Tag>
              </>
            ) : (
              project.stack.map((tech) => (
                <TechTag key={getTechName(tech)} item={tech} />
              ))
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

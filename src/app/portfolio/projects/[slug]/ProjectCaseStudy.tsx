'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/lib/types';
import Container from '@/components/Container';
import Button from '@/components/Button';
import TechTag from '@/components/TechTag';
import CaseStudySection from '@/components/case-study/CaseStudySection';
import { CASE_STUDY_SECTIONS, getSectionContent } from './case-study-config';
import { renderCaseStudyContent } from './renderCaseStudyContent';

interface ProjectCaseStudyProps {
  project: Project;
}

export default function ProjectCaseStudy({ project }: ProjectCaseStudyProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const meta = project.caseStudy?.meta;
  const hasAtAGlance =
    meta?.role || meta?.timeframe || meta?.company || meta?.impactSummary;
  const sectionsWithContent = CASE_STUDY_SECTIONS.filter((s) =>
    getSectionContent(project, s.id)
  );

  return (
    <div className="py-8 sm:py-12 md:py-16 lg:py-20" ref={topRef}>
      <Container>
        <Link
          href="/portfolio#projects"
          className="link-underline mb-8 inline-block text-sm font-medium text-foreground/50 transition-colors hover:text-foreground"
        >
          ← Back to Projects
        </Link>
      </Container>

      {/* Hero */}
      <header className="mb-12 md:mb-16">
        <Container>
          {project.heroImage && (
            <div className="relative mb-10 h-56 w-full overflow-hidden rounded-xl border border-border bg-muted md:h-72">
              <Image
                src={project.heroImage}
                alt=""
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 1024px"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30" />
            </div>
          )}
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground font-display sm:text-4xl md:text-5xl">
            {project.title}
          </h1>
          {project.tagline && (
            <p className="mb-6 text-lg text-foreground/70 sm:text-xl">
              {project.tagline}
            </p>
          )}
          <div className="mb-6 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <TechTag
                key={typeof tech === 'string' ? tech : tech.name}
                item={tech}
              />
            ))}
          </div>
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {project.links.map((link, idx) => (
                <Button
                  key={idx}
                  href={link.url}
                  variant={idx === 0 ? 'primary' : 'secondary'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </Button>
              ))}
            </div>
          )}
        </Container>
      </header>

      {/* At a Glance */}
      {hasAtAGlance && (
        <Container className="mb-12 md:mb-16">
          <div className="rounded-xl border border-border bg-muted/30 p-6 sm:p-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/50">
              At a Glance
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {meta?.role && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Role
                  </dt>
                  <dd className="mt-1 text-foreground">{meta.role}</dd>
                </div>
              )}
              {meta?.timeframe && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Timeframe
                  </dt>
                  <dd className="mt-1 text-foreground">{meta.timeframe}</dd>
                </div>
              )}
              {meta?.company && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Company / Product
                  </dt>
                  <dd className="mt-1 text-foreground">{meta.company}</dd>
                </div>
              )}
              {meta?.impactSummary && (
                <div className="sm:col-span-2 lg:col-span-1">
                  <dt className="text-xs font-medium uppercase tracking-wider text-foreground/50">
                    Impact
                  </dt>
                  <dd className="mt-1 text-sm text-foreground/85">
                    {meta.impactSummary}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </Container>
      )}

      {/* Single column, centered */}
      <Container>
        <div className="mx-auto max-w-3xl">
          <main>
            {sectionsWithContent.length > 0 ? (
              <div className="space-y-1">
                {sectionsWithContent.map((section) => {
                  const content = getSectionContent(project, section.id);
                  if (!content) return null;
                  return (
                    <CaseStudySection
                      key={section.id}
                      id={section.id}
                      title={section.title}
                      subtitle={section.subtitle}
                    >
                      {renderCaseStudyContent(content)}
                    </CaseStudySection>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-5 text-foreground/85 [&>p]:leading-relaxed [&>ul]:ml-5 [&>ul]:list-disc [&>ul]:space-y-2">
                {renderCaseStudyContent(project.content)}
              </div>
            )}

            {/* Stack */}
            <section className="scroll-mt-28 border-t border-border pt-10">
              <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground font-display">
                Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <TechTag
                    key={typeof tech === 'string' ? tech : tech.name}
                    item={tech}
                  />
                ))}
              </div>
            </section>

            {/* Back to top */}
            <div className="mt-12 pt-8 border-t border-border">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  topRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-sm font-medium text-foreground/60 underline-offset-2 hover:text-foreground hover:underline"
              >
                Back to top
              </a>
            </div>

            <p className="mt-8 text-xs text-foreground/40">
              Case study prepared for portfolio. Details may be simplified or
              anonymized where appropriate.
            </p>
          </main>
        </div>
      </Container>
    </div>
  );
}

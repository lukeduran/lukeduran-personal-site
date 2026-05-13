'use client';

import Image from 'next/image';
import { getSiteContent, getEnabledProjects, getModeContent } from '@/lib/content';
import { useMode } from '@/lib/mode-context';
import Section from '@/components/Section';
import Button from '@/components/Button';
import ProjectCard from '@/components/ProjectCard';
import TimelineItem from '@/components/TimelineItem';
import Tag from '@/components/Tag';
import Hero from '@/components/Hero';
import { Code, Database, Target } from 'lucide-react';

export default function Home() {
  const content = getSiteContent();
  const { mode } = useMode();
  const modeContent = getModeContent(mode);
  const projects = getEnabledProjects(mode);

  return (
    <>
      {/* Hero Section */}
      <Section id="hero" className="py-8 sm:py-12 md:py-16 lg:py-24">
        <Hero />
      </Section>

      {/* About Section */}
      <Section id="about" alternate>
        <div>
          <h2 className="mb-6 sm:mb-8 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground font-display sm:text-5xl">
            About
          </h2>
          <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed text-foreground/80">
            {modeContent.about.paragraph}
          </p>
          {modeContent.about.bullets && modeContent.about.bullets.length > 0 && (
            <ul className="space-y-3">
              {modeContent.about.bullets.map((bullet, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-foreground/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Section>

      {/* Experience Section */}
      <Section id="experience">
        <div>
          <h2 className="mb-8 sm:mb-12 md:mb-16 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground font-display sm:text-5xl">
            Experience
          </h2>
          <div className="relative">
            {modeContent.experience.map((exp, idx) => (
              <TimelineItem
                key={idx}
                experience={exp}
                isLast={idx === modeContent.experience.length - 1}
                index={idx}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Projects Section */}
      {content.sections.showProjects && projects.length > 0 && (
        <Section id="projects" alternate>
          <div>
            <h2 className="mb-8 sm:mb-12 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground font-display sm:text-5xl">
              Projects
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, idx) => (
                <ProjectCard key={project.slug} project={project} index={idx} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Skills Section */}
      <Section id="skills">
        <div>
          <h2 className="mb-8 sm:mb-12 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground font-display sm:text-5xl">
            Skills
          </h2>
          <div className="grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(modeContent.skills).map(([category, items]) => {
              let IconComponent;
              if (category === 'Product') {
                IconComponent = <Target className="h-5 w-5 text-accent/60" strokeWidth={1.5} />;
              } else if (category === 'Technical') {
                IconComponent = <Code className="h-5 w-5 text-accent/60" strokeWidth={1.5} />;
              } else if (category === 'Data') {
                IconComponent = <Database className="h-5 w-5 text-accent/60" strokeWidth={1.5} />;
              } else {
                IconComponent = <Code className="h-5 w-5 text-accent/60" strokeWidth={1.5} />;
              }

              return (
                <div key={category}>
                  <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-foreground">
                    {IconComponent}
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2.5">
                    {items.map((skill) => (
                      <Tag key={skill}>{skill}</Tag>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* Education Section */}
      {content.sections.showEducation && modeContent.education && modeContent.education.length > 0 && (
        <Section id="education" alternate>
          <div>
            <h2 className="mb-8 sm:mb-12 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground font-display sm:text-5xl">
              Education
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {modeContent.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-xl border border-border bg-background p-6 transition-shadow hover:border-accent/30 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold text-foreground font-display">
                        {edu.degree}
                      </h3>
                      <p className="mb-2 text-base font-medium text-foreground/70">
                        {edu.school}
                      </p>
                      <p className="mb-3 text-sm text-foreground/50">{edu.dates}</p>
                      {edu.notes && (
                        <p className="text-sm text-foreground/60">{edu.notes}</p>
                      )}
                    </div>
                    {edu.logo ? (
                      <div className="ml-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                        <Image
                          src={edu.logo}
                          alt={`${edu.school} logo`}
                          width={64}
                          height={64}
                          className="h-full w-full object-contain p-2"
                        />
                      </div>
                    ) : (
                      <div className="ml-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50">
                        <span className="text-xs font-medium text-foreground/40">
                          {edu.school.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Contact Section */}
      <Section id="contact">
        <div className="text-center">
          <h2 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tighter text-foreground font-display sm:text-5xl">
            {modeContent.contact?.heading || 'Contact'}
          </h2>
          <p className="mb-6 sm:mb-8 text-base sm:text-lg text-foreground/70">
            {modeContent.contact?.copy || "Let's connect and discuss opportunities."}
          </p>
          <Button
            href={`mailto:${content.person.email}`}
            variant="primary"
          >
            {modeContent.contact?.buttonLabel || 'Email Luke'}
          </Button>
        </div>
      </Section>
    </>
  );
}

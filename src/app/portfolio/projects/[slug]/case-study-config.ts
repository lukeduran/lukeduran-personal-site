import type { TocItem } from '@/components/case-study/TableOfContents';
import type { Project, CaseStudySectionId } from '@/lib/types';

export type { CaseStudySectionId } from '@/lib/types';

export const CASE_STUDY_SECTION_IDS: CaseStudySectionId[] = [
  'context',
  'businessChallenge',
  'myRoleScope',
  'strategyTradeoffs',
  'executionHighlights',
  'resultsImpact',
  'whatIdDoDifferently',
];

export const CASE_STUDY_SECTIONS: { id: CaseStudySectionId; title: string; subtitle?: string }[] = [
  { id: 'context', title: 'Context', subtitle: 'Background and setting' },
  { id: 'businessChallenge', title: 'The Business Challenge', subtitle: 'What was at stake' },
  { id: 'myRoleScope', title: 'My Role & Scope', subtitle: 'Ownership and boundaries' },
  { id: 'strategyTradeoffs', title: 'Strategy & Tradeoffs', subtitle: 'Decisions and alternatives' },
  { id: 'executionHighlights', title: 'Execution Highlights', subtitle: 'How we delivered' },
  { id: 'resultsImpact', title: 'Results & Impact', subtitle: 'Outcomes and metrics' },
  { id: 'whatIdDoDifferently', title: "What I'd Do Differently", subtitle: 'Lessons learned' },
];

export function getTocItems(project: Project): TocItem[] {
  if (!project.caseStudy?.sections) return [];
  return CASE_STUDY_SECTIONS.filter((s) => getSectionContent(project, s.id)).map((s) => ({
    id: s.id,
    label: s.title,
  }));
}

export function getSectionContent(
  project: Project,
  sectionId: CaseStudySectionId
): string | undefined {
  const raw = project.caseStudy?.sections?.[sectionId];
  if (raw == null) return undefined;
  return Array.isArray(raw) ? raw.join('\n\n') : raw;
}

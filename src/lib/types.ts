export type SiteMode = 'professional' | 'personal';

export interface HeroContent {
  name: string;
  role: string;
  location?: string;
  valueProp?: string;
  currently?: string;
  currentlyEnabled?: boolean;
  badges?: string[];
  headshot?: string | null;
}

export interface AboutContent {
  paragraph: string;
  bullets?: string[];
}

export interface ContactContent {
  heading?: string;
  copy?: string;
  buttonLabel?: string;
}

export interface ModeContent {
  hero: HeroContent;
  about: AboutContent;
  experience: ExperienceItem[];
  projects: Project[];
  skills: {
    [key: string]: string[];
  };
  education?: EducationItem[];
  contact?: ContactContent;
}

export interface SiteContent {
  site: {
    title: string;
    description: string;
    url?: string;
  };
  person: {
    email: string;
    socials?: {
      linkedin?: string;
      github?: string;
    };
  };
  cta: {
    resumePdfPath: string;
    resumeLabel: string;
  };
  chat?: {
    intro?: string;
  };
  sections: {
    showProjects: boolean;
    showEducation?: boolean;
    enablePersonalMode?: boolean;
  };
  professional: ModeContent;
  personal: ModeContent;
}

export interface ExperienceRole {
  title: string;
  start: string;
  end: string;
  impact?: string;
  highlights?: string[];
}

/** Tech entry: string (name only) or object with name + optional custom icon URL */
export type TechItem = string | { name: string; icon?: string | null };

export interface ExperienceItem {
  company: string;
  location?: string;
  industry?: string; // Single label for pill/badge (e.g. "PropTech", "Entertainment")
  start: string; // Overall start date (first role)
  end: string; // Overall end date (last role)
  logo?: string | null;
  roles: ExperienceRole[]; // Array of roles at this company
  tech?: TechItem[]; // Shared tech stack across all roles
  domains?: string[]; // Shared domains across all roles
}

export interface ProjectLink {
  label: string;
  url: string;
}

/** At-a-glance metadata for the case study hero. */
export interface CaseStudyMeta {
  role?: string;
  timeframe?: string;
  company?: string;
  impactSummary?: string;
}

/** Case study section content. Use string (use \n\n for paragraph breaks) or string[] (one paragraph per item). */
export interface CaseStudySections {
  context?: string | string[];
  businessChallenge?: string | string[];
  myRoleScope?: string | string[];
  strategyTradeoffs?: string | string[];
  executionHighlights?: string | string[];
  resultsImpact?: string | string[];
  whatIdDoDifferently?: string | string[];
}

export type CaseStudySectionId = keyof CaseStudySections;

/**
 * Case study: single data shape only (no legacy overview/problem/approach/outcome).
 * When present, the project page uses meta + sections; when absent, it falls back to `content`.
 */
export interface CaseStudy {
  meta?: CaseStudyMeta;
  sections: CaseStudySections;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  stack: TechItem[];
  links?: ProjectLink[];
  heroImage?: string | null;
  /** Fallback body when no caseStudy, or supplementary markdown. */
  content: string;
  /** When set, the case study page uses meta + sections. One shape only. */
  caseStudy?: CaseStudy;
}

export interface EducationItem {
  school: string;
  degree: string;
  dates: string;
  notes?: string;
  logo?: string | null;
}

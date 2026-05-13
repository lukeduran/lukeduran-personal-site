import { SiteContent, Project, SiteMode, ModeContent } from './types';
import siteData from '../content/site.json';

// Validate and load content
const content = siteData as SiteContent;

// Simple validation
if (!content.site || !content.person || !content.professional || !content.personal) {
  throw new Error('Invalid site.json structure');
}

export function getSiteContent(): SiteContent {
  return content;
}

export function getModeContent(mode: SiteMode): ModeContent {
  return mode === 'professional' ? content.professional : content.personal;
}

export function getAllProjects(mode: SiteMode = 'professional'): Project[] {
  const modeContent = getModeContent(mode);
  return modeContent.projects;
}

export function getProjectBySlug(slug: string, mode: SiteMode = 'professional'): Project | undefined {
  const modeContent = getModeContent(mode);
  return modeContent.projects.find((project) => project.slug === slug);
}

export function getEnabledProjects(mode: SiteMode = 'professional'): Project[] {
  if (!content.sections.showProjects) {
    return [];
  }
  return getAllProjects(mode);
}

export default content;

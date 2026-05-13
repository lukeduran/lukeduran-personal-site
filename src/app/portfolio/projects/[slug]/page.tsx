import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjects, getSiteContent } from '@/lib/content';
import Container from '@/components/Container';
import Button from '@/components/Button';
import ProjectCaseStudy from './ProjectCaseStudy';

export function generateStaticParams() {
  const content = getSiteContent();
  if (!content.sections.showProjects) {
    return [];
  }
  const professionalProjects = getAllProjects('professional');
  const personalProjects = getAllProjects('personal');
  const allProjects = [...professionalProjects, ...personalProjects];
  const uniqueProjects = Array.from(
    new Map(allProjects.map((p) => [p.slug, p])).values()
  );
  return uniqueProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const content = getSiteContent();
  let project = getProjectBySlug(params.slug, 'professional');
  if (!project) {
    project = getProjectBySlug(params.slug, 'personal');
  }

  if (!project) {
    if (content.sections.showProjects) {
      notFound();
    } else {
      return (
        <Container>
          <div className="py-24 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">
              Coming Soon
            </h1>
            <p className="mb-8 text-foreground/70">
              Projects are currently being updated. Check back soon!
            </p>
            <Button href="/portfolio" variant="secondary">
              Return Home
            </Button>
          </div>
        </Container>
      );
    }
  }

  return (
    <Container className="max-w-6xl">
      <ProjectCaseStudy project={project} />
    </Container>
  );
}

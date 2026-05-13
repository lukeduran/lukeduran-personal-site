import { getSiteContent } from '@/lib/content';
import Nav from '@/components/Nav';


const content = getSiteContent();

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main>{children}</main>
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-foreground/50">
              © {new Date().getFullYear()} {content.professional.hero.name}. All rights reserved.
            </p>
            <div className="flex gap-6">
              {content.person.socials?.linkedin && (
                <a
                  href={content.person.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/50 transition-colors hover:text-foreground"
                >
                  LinkedIn
                </a>
              )}
              {content.person.socials?.github && (
                <a
                  href={content.person.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/50 transition-colors hover:text-foreground"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

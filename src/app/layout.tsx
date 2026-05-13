import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { getSiteContent } from '@/lib/content';
import { ModeProvider } from '@/lib/mode-context';
import FloatingExperienceToggle from '@/components/FloatingExperienceToggle';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700'],
});

const content = getSiteContent();

export const metadata: Metadata = {
  title: {
    default: content.site.title,
    template: `%s | ${content.site.title}`,
  },
  description: content.site.description,
  openGraph: {
    title: content.site.title,
    description: content.site.description,
    type: 'website',
    url: content.site.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} ${inter.className}`}>
        <ModeProvider>
          {children}
          <FloatingExperienceToggle />
        </ModeProvider>
      </body>
    </html>
  );
}

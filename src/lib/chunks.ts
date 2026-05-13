import fs from 'fs';
import path from 'path';
import siteData from '../content/site.json';

export interface Chunk {
  id: string;
  label: string;
  content: string;
}

function loadContextFile(filename: string): string {
  const filePath = path.join(process.cwd(), 'src/content/context', filename);
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8').trim();
}

function parseFaqChunks(raw: string): Chunk[] {
  const chunks: Chunk[] = [];
  const lines = raw.split('\n');
  let question = '';
  let answer = '';
  let idx = 0;

  const flush = () => {
    if (!question || !answer) return;
    chunks.push({
      id: `faq-${idx++}`,
      label: `FAQ: ${question}`,
      content: `Q: ${question}\nA: ${answer.trim()}`,
    });
    question = '';
    answer = '';
  };

  for (const line of lines) {
    if (line.startsWith('Q: ')) {
      flush();
      question = line.slice(3).trim();
    } else if (line.startsWith('A: ')) {
      answer = line.slice(3);
    } else if (question && answer) {
      answer += ' ' + line.trim();
    }
  }
  flush();

  return chunks;
}

function parseMarkdownSections(raw: string, prefix: string): Chunk[] {
  const chunks: Chunk[] = [];
  // Strip HTML comments
  const cleaned = raw.replace(/<!--[\s\S]*?-->/g, '').trim();
  // Split on ## headings
  const parts = cleaned.split(/\n(?=## )/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.length < 40) continue;
    // Skip top-level # headings that are just titles
    if (/^#[^#]/.test(trimmed) && trimmed.split('\n').length <= 2) continue;

    const firstLine = trimmed.split('\n')[0].replace(/^#+\s*/, '').trim();
    if (!firstLine) continue;

    const id = `${prefix.toLowerCase().replace(/\s+/g, '-')}-${firstLine.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    chunks.push({
      id,
      label: `${prefix}: ${firstLine}`,
      content: trimmed,
    });
  }

  return chunks;
}

type TechEntry = string | { name: string; icon?: string };
type SkillMap = Record<string, string[]>;

export function buildChunks(): Chunk[] {
  const p = siteData.professional;
  const chunks: Chunk[] = [];

  // Bio
  chunks.push({
    id: 'bio',
    label: 'About Luke',
    content: p.about.paragraph,
  });

  // Experience — one chunk per role
  for (const exp of p.experience) {
    for (const role of exp.roles) {
      const techList = (exp.tech as TechEntry[])
        .map((t) => (typeof t === 'string' ? t : t.name))
        .join(', ');
      const highlights = role.highlights.map((h) => `- ${h}`).join('\n');
      const id = `exp-${exp.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${role.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

      chunks.push({
        id,
        label: `Experience: ${role.title} at ${exp.company}`,
        content: [
          `${role.title} at ${exp.company} (${exp.industry ?? ''}, ${role.start}–${role.end})`,
          role.impact,
          highlights,
          techList ? `Tech: ${techList}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      });
    }
  }

  // Projects — one chunk per project
  for (const proj of p.projects) {
    const stack = (proj.stack as TechEntry[])
      .map((t) => (typeof t === 'string' ? t : t.name))
      .join(', ');

    const parts: string[] = [`${proj.title} — ${proj.tagline}`, proj.summary];

    const cs = proj.caseStudy?.sections as Record<string, string | string[]> | undefined;
    if (cs?.context) {
      parts.push(`Context: ${Array.isArray(cs.context) ? cs.context.join(' ') : cs.context}`);
    }
    if (cs?.businessChallenge) {
      parts.push(
        `Challenge: ${Array.isArray(cs.businessChallenge) ? cs.businessChallenge.join(' ') : cs.businessChallenge}`
      );
    }
    if (cs?.resultsImpact) {
      parts.push(
        `Results: ${Array.isArray(cs.resultsImpact) ? cs.resultsImpact.join(' ') : cs.resultsImpact}`
      );
    }
    if (stack) parts.push(`Stack: ${stack}`);

    chunks.push({
      id: `project-${proj.slug}`,
      label: `Project: ${proj.title}`,
      content: parts.join('\n'),
    });
  }

  // Skills
  const skillLines = Object.entries(p.skills as SkillMap).map(
    ([category, skills]) => `${category}: ${skills.join(', ')}`
  );
  chunks.push({
    id: 'skills',
    label: 'Skills',
    content: `Skills and expertise:\n${skillLines.join('\n')}`,
  });

  // Education
  const eduLines = p.education.map(
    (e) => `${e.degree}, ${e.school} (${e.dates})`
  );
  chunks.push({
    id: 'education',
    label: 'Education',
    content: `Education:\n${eduLines.join('\n')}`,
  });

  // FAQ — one chunk per Q&A pair
  const faqRaw = loadContextFile('faq.md');
  if (faqRaw) chunks.push(...parseFaqChunks(faqRaw));

  // Narrative markdown files — one chunk per ## section
  const mdFiles: { file: string; prefix: string }[] = [
    { file: 'career-narrative.md', prefix: 'Career Narrative' },
    { file: 'product-philosophy.md', prefix: 'Product Philosophy' },
    { file: 'working-style.md', prefix: 'Working Style' },
  ];

  for (const { file, prefix } of mdFiles) {
    const raw = loadContextFile(file);
    if (raw) chunks.push(...parseMarkdownSections(raw, prefix));
  }

  return chunks;
}

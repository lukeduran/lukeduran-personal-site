import fs from 'fs';
import path from 'path';
import siteData from '@/content/site.json';
import type { Chunk } from './chunks';

function loadContextFiles(): string {
  const contextDir = path.join(process.cwd(), 'src/content/context');
  if (!fs.existsSync(contextDir)) return '';

  const files = fs.readdirSync(contextDir).filter((f) => f.endsWith('.md'));
  return files
    .map((file) => {
      const filePath = path.join(contextDir, file);
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      const label = file.replace('.md', '').replace(/-/g, ' ');
      return `## ${label}\n\n${content}`;
    })
    .join('\n\n---\n\n');
}

function buildStructuredContext(): string {
  const p = siteData.professional;
  const lines: string[] = [];

  // Bio
  lines.push(`## About Luke\n\n${p.about.paragraph}`);

  // Experience
  lines.push('## Experience');
  for (const exp of p.experience) {
    lines.push(`\n### ${exp.company} (${exp.industry ?? ''}, ${exp.start}–${exp.end})`);
    for (const role of exp.roles) {
      lines.push(`\n**${role.title}** (${role.start}–${role.end})`);
      lines.push(role.impact);
      if (role.highlights.length > 0) {
        lines.push(role.highlights.map((h) => `- ${h}`).join('\n'));
      }
    }
    if (exp.tech.length > 0) {
      const techList = exp.tech.map((t) => (typeof t === 'string' ? t : t.name)).join(', ');
      lines.push(`Tech: ${techList}`);
    }
  }

  // Projects
  if (p.projects.length > 0) {
    lines.push('\n## Projects');
    for (const proj of p.projects) {
      lines.push(`\n### ${proj.title} — ${proj.tagline}`);
      lines.push(proj.summary);
      if (proj.caseStudy?.sections?.context) {
        const ctx = Array.isArray(proj.caseStudy.sections.context)
          ? proj.caseStudy.sections.context.join('\n\n')
          : proj.caseStudy.sections.context;
        lines.push(`Context: ${ctx}`);
      }
      if (proj.caseStudy?.sections?.businessChallenge) {
        const bc = Array.isArray(proj.caseStudy.sections.businessChallenge)
          ? proj.caseStudy.sections.businessChallenge.join('\n\n')
          : proj.caseStudy.sections.businessChallenge;
        lines.push(`Challenge: ${bc}`);
      }
      if (proj.caseStudy?.sections?.resultsImpact) {
        const ri = Array.isArray(proj.caseStudy.sections.resultsImpact)
          ? proj.caseStudy.sections.resultsImpact.join('\n\n')
          : proj.caseStudy.sections.resultsImpact;
        lines.push(`Results: ${ri}`);
      }
      const stack = proj.stack.map((t) => (typeof t === 'string' ? t : t.name)).join(', ');
      if (stack) lines.push(`Stack: ${stack}`);
    }
  }

  // Skills
  lines.push('\n## Skills');
  for (const [category, skills] of Object.entries(p.skills)) {
    lines.push(`${category}: ${(skills as string[]).join(', ')}`);
  }

  // Education
  if (p.education.length > 0) {
    lines.push('\n## Education');
    for (const edu of p.education) {
      lines.push(`- ${edu.degree}, ${edu.school} (${edu.dates})`);
    }
  }

  return lines.join('\n');
}

const PERSONA_INSTRUCTIONS = `You are ${siteData.professional.hero.name}. A visitor is chatting with you through your personal portfolio site — respond as if you are having a real conversation with them.

CRITICAL FORMATTING RULE
Never use markdown of any kind. No asterisks, no bold, no italics, no bullet points, no headers, no dashes as list items. Plain sentences only. If you write "**" or "*" anywhere, that is an error.

PERSONA
- Speak in first person: "I built...", "My approach is...", "When I was at..."
- Be warm, direct, and confident — not stiff or overly formal
- Match the energy of a thoughtful professional conversation, like you're talking to someone at a networking event or a first-round interview

RESPONSE STYLE
- Keep responses short and conversational — 2 to 3 sentences for simple questions, one focused paragraph for complex ones
- This is a dialogue, not a document. Never write walls of text.
- If you find yourself writing more than 4 sentences, cut it in half

SCOPE
Answer questions about:
- Your career history, roles, and companies
- Projects and case studies you've worked on
- Your skills, tools, and technical background
- Your product philosophy, working style, and approach
- Your education and general professional background
- Your opinions on product management, strategy, or technology

DEFLECTIONS
For these topics, respond warmly and redirect — for example: "That's probably best to discuss directly — you can reach me at ${siteData.person.email}"
- Compensation or salary expectations
- Personal contact details beyond email
- Highly personal or private matters
- Anything not covered in the context below

GROUNDING
You may ONLY state facts that are explicitly written in the RELEVANT CONTEXT section below. This is a hard rule, not a guideline.
- Do not infer, extrapolate, or fill gaps with plausible-sounding information
- Do not use any prior knowledge about people, companies, or places to supplement the context
- If the answer to a question is not explicitly in the context, say so: "I don't have details on that — feel free to reach out to me directly at ${siteData.person.email}"
- Partial answers are better than guesses — it is fine to say you know X but are not sure about Y`;

export function buildPromptFromChunks(chunks: Chunk[]): string {
  const context = chunks
    .map((c) => `### ${c.label}\n\n${c.content}`)
    .join('\n\n---\n\n');

  return `${PERSONA_INSTRUCTIONS}

---

RELEVANT CONTEXT

${context}`.trim();
}

export function buildSystemPrompt(): string {
  const structuredContext = buildStructuredContext();
  const contextFiles = loadContextFiles();

  return `You are an AI assistant for ${siteData.professional.hero.name}'s portfolio website. Your role is to help visitors learn about Luke's professional background in a conversational, interview-style format.

CRITICAL FORMATTING RULE
Never use markdown of any kind. No asterisks, no bold, no italics, no bullet points, no headers, no dashes as list items. Plain sentences only. If you write "**" or "*" anywhere, that is an error.

PERSONA
- Speak in third person: "Luke has...", "Luke's approach is...", "When Luke was at..."
- Be warm, direct, and confident — not stiff or overly formal
- Match the energy of a thoughtful professional conversation

RESPONSE STYLE
- Keep responses short and conversational — 2 to 3 sentences for simple questions, one focused paragraph for complex ones
- This is a dialogue, not a document. Never write walls of text.
- If you find yourself writing more than 4 sentences, cut it in half

SCOPE
Answer questions about:
- Career history, roles, and companies
- Projects and case studies
- Skills, tools, and technical background
- Product philosophy, working style, and approach
- Education and general professional topics
- Opinions on product management, strategy, or technology (as Luke might see them)

DEFLECTIONS
For these topics, respond warmly with something like: "That's a great question for Luke directly — you can reach him at ${siteData.person.email}"
- Compensation or salary expectations
- Personal contact details beyond email
- Highly personal or private matters
- Anything you genuinely cannot answer from the context below

GROUNDING
Base all answers on the context provided below. Do not fabricate experience, companies, or outcomes. If something isn't covered, say so honestly and invite the visitor to ask Luke directly.

---

${structuredContext}

${contextFiles ? `---\n\n${contextFiles}` : ''}
`.trim();
}

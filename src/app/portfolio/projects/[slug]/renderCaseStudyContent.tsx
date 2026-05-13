'use client';

import { ReactNode } from 'react';
import Callout from '@/components/case-study/Callout';

/**
 * Renders case study section content: paragraphs, lists, ## headings, and optional callout blocks.
 * Callout syntax: ::type (decision|tradeoff|impact) on its own line, then lines until next ::
 */
export function renderCaseStudyContent(content: string): ReactNode[] {
  const lines = content.split('\n');
  const elements: ReactNode[] = [];
  let currentParagraph: string[] = [];
  let listItems: string[] = [];
  let inList = false;
  let calloutBuffer: { type: 'decision' | 'tradeoff' | 'impact'; lines: string[] } | null = null;

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={elements.length} className="mb-4 leading-relaxed">
          {currentParagraph.join(' ')}
        </p>
      );
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="mb-4 ml-5 list-disc space-y-2">
          {listItems.map((item, idx) => (
            <li key={idx}>{item.replace(/^[-*]\s+/, '')}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };

  const flushCallout = () => {
    if (calloutBuffer && calloutBuffer.lines.length > 0) {
      const text = calloutBuffer.lines.join(' ').trim();
      if (text) {
        elements.push(
          <Callout key={elements.length} variant={calloutBuffer.type}>
            <p>{text}</p>
          </Callout>
        );
      }
      calloutBuffer = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.match(/^::(decision|tradeoff|impact)\s*$/)) {
      flushParagraph();
      flushList();
      flushCallout();
      const type = trimmed.replace(/^::|\s*$/g, '') as 'decision' | 'tradeoff' | 'impact';
      calloutBuffer = { type, lines: [] };
      continue;
    }
    if (trimmed === '::' && calloutBuffer) {
      flushCallout();
      continue;
    }
    if (calloutBuffer) {
      calloutBuffer.lines.push(trimmed);
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={elements.length} className="mb-3 mt-6 text-lg font-semibold text-foreground">
          {trimmed.replace(/^##\s+/, '')}
        </h3>
      );
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushParagraph();
      if (!inList) inList = true;
      listItems.push(trimmed);
    } else if (trimmed === '') {
      flushParagraph();
      flushList();
    } else {
      if (inList) flushList();
      currentParagraph.push(trimmed);
    }
  }

  flushParagraph();
  flushList();
  flushCallout();

  return elements;
}

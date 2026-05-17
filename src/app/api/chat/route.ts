import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPromptFromChunks } from '@/lib/buildSystemPrompt';
import { retrieveChunks } from '@/lib/retrieval';

let anthropicClient: Anthropic | null = null;
function getAnthropic(): Anthropic {
  if (!anthropicClient) anthropicClient = new Anthropic();
  return anthropicClient;
}

// In-memory rate limiter: 20 requests per 10 minutes per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

function isAllowedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const allowed = [
    appUrl,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean);

  return allowed.some((o) => origin === o || origin.startsWith(o as string));
}

export async function POST(req: NextRequest) {
  if (!isAllowedOrigin(req)) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const lastUserMessage = [...messages].reverse().find(
      (m: { role: string; content: string }) => m.role === 'user'
    );
    const query = lastUserMessage?.content ?? '';
    const { chunks, confident } = await retrieveChunks(query, 5);
    console.log('[RAG] confident:', confident, '| retrieved:', chunks.map((c) => c.label));

    if (!confident) {
      const deflection = `That's not something I have details on — I can really only speak to my professional background, projects, and how I work. For anything outside of that, feel free to reach out to me directly at hello@luketduran.com.`;
      const encoder = new TextEncoder();
      return new Response(encoder.encode(deflection), {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const systemPrompt = buildPromptFromChunks(chunks);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = getAnthropic().messages.stream({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            temperature: 0,
            system: systemPrompt,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
          });

          stream.on('text', (text: string) => {
            controller.enqueue(encoder.encode(text));
          });

          await stream.done();
        } catch (err) {
          console.error('[/api/chat stream]', err);
          controller.enqueue(
            encoder.encode('Sorry, something went wrong. Please try again.')
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    console.error('[/api/chat]', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

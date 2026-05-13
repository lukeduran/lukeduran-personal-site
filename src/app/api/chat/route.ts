import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { buildPromptFromChunks } from '@/lib/buildSystemPrompt';
import { retrieveChunks } from '@/lib/retrieval';

const client = new Anthropic();

export async function POST(req: NextRequest) {
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
    const chunks = await retrieveChunks(query, 5);
    console.log('[RAG] retrieved:', chunks.map((c) => c.label));
    const systemPrompt = buildPromptFromChunks(chunks);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          const stream = client.messages.stream({
            model: 'claude-haiku-4-5-20251001',
            max_tokens: 1024,
            system: systemPrompt,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role as 'user' | 'assistant',
              content: m.content,
            })),
          });

          stream.on('text', (text) => {
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

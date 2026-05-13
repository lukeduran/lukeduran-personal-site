import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import type { Chunk } from './chunks';

interface EmbeddedChunk extends Chunk {
  embedding: number[];
}

let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) openaiClient = new OpenAI();
  return openaiClient;
}

// Loaded once at first call, reused across requests
let cachedEmbeddings: EmbeddedChunk[] | null = null;

function loadEmbeddings(): EmbeddedChunk[] {
  if (cachedEmbeddings) return cachedEmbeddings;
  const filePath = path.join(process.cwd(), 'src/content/embeddings.json');
  if (!fs.existsSync(filePath)) {
    throw new Error('embeddings.json not found — run `npm run embed` first');
  }
  cachedEmbeddings = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return cachedEmbeddings!;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function retrieveChunks(query: string, topK = 5): Promise<Chunk[]> {
  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const queryEmbedding = response.data[0].embedding;

  const embeddings = loadEmbeddings();

  const scored = embeddings.map((chunk) => ({
    chunk,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK).map(({ chunk }) => ({
    id: chunk.id,
    label: chunk.label,
    content: chunk.content,
  }));
}

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

// Minimum cosine similarity score to consider a chunk relevant.
// Queries that score below this threshold against all chunks are considered
// out-of-scope and should be deflected rather than answered.
const MIN_RELEVANCE_SCORE = 0.35;

export interface RetrievalResult {
  chunks: Chunk[];
  confident: boolean;
}

export async function retrieveChunks(query: string, topK = 5): Promise<RetrievalResult> {
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

  const topScored = scored.slice(0, topK);
  const confident = topScored[0]?.score >= MIN_RELEVANCE_SCORE;

  return {
    chunks: topScored.map(({ chunk }) => ({
      id: chunk.id,
      label: chunk.label,
      content: chunk.content,
    })),
    confident,
  };
}

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { buildChunks } from '../src/lib/chunks';

const openai = new OpenAI();

async function main() {
  const chunks = buildChunks();
  console.log(`Embedding ${chunks.length} chunks...`);

  const results = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    process.stdout.write(`  [${i + 1}/${chunks.length}] ${chunk.label}\n`);

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: chunk.content,
    });

    results.push({
      id: chunk.id,
      label: chunk.label,
      content: chunk.content,
      embedding: response.data[0].embedding,
    });
  }

  const outPath = path.join(process.cwd(), 'src/content/embeddings.json');
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} embeddings to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

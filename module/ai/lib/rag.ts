import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { pineconeIndex } from "@/lib/pinecone";

export async function generateEmbeddings(text: string) {
  try {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is missing in environment variables");
    }

    const { embedding } = await embed({
      model: google.embeddingModel("gemini-embedding-001"),
      value: text,
    });
    return embedding;
  } catch (error: any) {
    console.error("Embedding generation error details:", error);
    throw error;
  }
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[]
) {
  console.log(`Starting indexing for ${repoId} with ${files.length} files`);
  const vecters = [];

  for (const file of files) {
    const content = `File: ${file.path}\n\n${file.content}`;
    const truncatedContent = content.slice(0, 8000);

    try {
      const embedding = await generateEmbeddings(truncatedContent);

      vecters.push({
        id: `${repoId}-${file.path.replace(/\//g, "_")}`,
        values: embedding,
        metadata: {
          repoId,
          path: file.path,
          content: truncatedContent,
        },
      });
      console.log(`Successfully embedded ${file.path}`);
    } catch (error) {
      console.error(`Failed to embed ${file.path}:`, error);
    }
  }

  if (vecters.length > 0) {
    console.log(`Upserting ${vecters.length} vectors to Pinecone...`);
    const batchSize = 100;
    for (let i = 0; i < vecters.length; i += batchSize) {
      const batch = vecters.slice(i, i + batchSize);
      await pineconeIndex.upsert(batch);
    }
    console.log("Indexing completed successfully!");
  } else {
    console.error(`Indexing failed: No vectors were generated for ${repoId}`);
    if (files.length > 0) {
      throw new Error(`Failed to index ${repoId}: All embedding attempts failed. Check if GOOGLE_GENERATIVE_AI_API_KEY is correctly set.`);
    }
  }
}

export async function retriveContent(query: string, repoId: string, topk: number = 3) {
  const queryEmbedding = await generateEmbeddings(query);

  const context = await pineconeIndex.query({
    vector: queryEmbedding,
    filter: {
      repoId: {
        $eq: repoId
      }
    },
    topK: topk,
    includeMetadata: true
  });

  return context.matches.map(match => match.metadata?.content as string).filter(Boolean);

}
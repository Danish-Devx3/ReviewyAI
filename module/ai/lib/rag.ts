import { embed } from "ai";
import { google } from "@ai-sdk/google";
import { pinecone, pineconeIndex } from "@/lib/pinecone";

export async function generateEmbeddings(text: string) {
  const { embedding } = await embed({
    model: google.textEmbeddingModel("text-embedding-004"),
    value: text,
  });
  return embedding;
}

export async function indexCodebase(
  repoId: string,
  files: { path: string; content: string }[]
) {
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
    } catch (error) {
      console.error(`Failed to embed ${file.path}:`, error);
    }
  }

  if (vecters.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < vecters.length; i += batchSize) {
      const batch = vecters.slice(i, i + batchSize);
      await pineconeIndex.upsert(batch);
    }
  }

  console.log("Indexing completed!");
}

export async function retriveContent(query: string, repoId: string, topk: number=3){
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
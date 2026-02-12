import { Pinecone } from '@pinecone-database/pinecone'

// Pinecone Client Configuration
export const pineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

// Get index
export function getPineconeIndex(indexName: string) {
  return pineconeClient.index(indexName)
}

// Helper Functions
export async function upsertVectors(
  indexName: string,
  vectors: Array<{ id: string; values: number[]; metadata?: Record<string, any> }>
) {
  const index = getPineconeIndex(indexName)
  return await index.upsert(vectors)
}

export async function queryVectors(
  indexName: string,
  vector: number[],
  topK: number = 10,
  filter?: Record<string, any>
) {
  const index = getPineconeIndex(indexName)
  return await index.query({
    vector,
    topK,
    filter,
    includeMetadata: true,
  })
}

export async function deleteVectors(indexName: string, ids: string[]) {
  const index = getPineconeIndex(indexName)
  return await index.deleteMany(ids)
}

export async function fetchVectors(indexName: string, ids: string[]) {
  const index = getPineconeIndex(indexName)
  return await index.fetch(ids)
}

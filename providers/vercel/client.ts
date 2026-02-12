/**
 * Vercel Provider Configuration
 * 
 * Centralized configuration for Vercel platform services:
 * - Blob storage
 * - KV (Redis)
 * - Postgres
 * - Edge Config
 * - Deployment API
 */

// Vercel Blob Storage
export async function uploadToBlob(file: File) {
  // Use @vercel/blob package
  const { put } = await import('@vercel/blob')
  return await put(file.name, file, {
    access: 'public',
  })
}

// Vercel KV (Redis)
export async function getKV() {
  const { kv } = await import('@vercel/kv')
  return kv
}

// Vercel Postgres
export async function getPostgres() {
  const { sql } = await import('@vercel/postgres')
  return sql
}

// Vercel Edge Config
export async function getEdgeConfig() {
  const { get } = await import('@vercel/edge-config')
  return { get }
}

export const vercelConfig = {
  blobToken: process.env.BLOB_READ_WRITE_TOKEN,
  kvUrl: process.env.KV_REST_API_URL,
  kvToken: process.env.KV_REST_API_TOKEN,
  postgresUrl: process.env.POSTGRES_URL,
  edgeConfigId: process.env.EDGE_CONFIG,
}

/**
 * Shared Configuration Package
 * 
 * Centralized configuration for all services in the monorepo
 */

export interface DatabaseConfig {
  host: string
  port: number
  database: string
  username: string
  password: string
  poolSize?: number
  maxOverflow?: number
}

export interface RedisConfig {
  url: string
  cacheTTL?: number
}

export interface LLMConfig {
  openaiApiKey?: string
  anthropicApiKey?: string
  googleApiKey?: string
  groqApiKey?: string
  defaultProvider: string
  defaultModel: string
}

export interface VectorDBConfig {
  type: 'chroma' | 'pinecone' | 'qdrant'
  chromaHost?: string
  chromaPort?: number
  pineconeApiKey?: string
  pineconeEnvironment?: string
  qdrantUrl?: string
  qdrantApiKey?: string
}

export interface AppConfig {
  environment: 'development' | 'staging' | 'production'
  apiUrl: string
  database: DatabaseConfig
  redis: RedisConfig
  llm: LLMConfig
  vectorDb: VectorDBConfig
}

/**
 * Load configuration from environment variables
 */
export function loadConfig(): AppConfig {
  return {
    environment: (process.env.ENVIRONMENT as any) || 'development',
    apiUrl: process.env.API_URL || 'http://localhost:8000',
    database: {
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      database: process.env.DATABASE_NAME || 'postgres',
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20'),
      maxOverflow: parseInt(process.env.DATABASE_MAX_OVERFLOW || '10'),
    },
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      cacheTTL: parseInt(process.env.REDIS_CACHE_TTL || '3600'),
    },
    llm: {
      openaiApiKey: process.env.OPENAI_API_KEY,
      anthropicApiKey: process.env.ANTHROPIC_API_KEY,
      googleApiKey: process.env.GOOGLE_API_KEY,
      groqApiKey: process.env.GROQ_API_KEY,
      defaultProvider: process.env.DEFAULT_LLM_PROVIDER || 'openai',
      defaultModel: process.env.DEFAULT_LLM_MODEL || 'gpt-4o',
    },
    vectorDb: {
      type: (process.env.VECTOR_DB_TYPE as any) || 'chroma',
      chromaHost: process.env.CHROMA_HOST || 'localhost',
      chromaPort: parseInt(process.env.CHROMA_PORT || '8000'),
      pineconeApiKey: process.env.PINECONE_API_KEY,
      pineconeEnvironment: process.env.PINECONE_ENVIRONMENT,
      qdrantUrl: process.env.QDRANT_URL,
      qdrantApiKey: process.env.QDRANT_API_KEY,
    },
  }
}

export const config = loadConfig()

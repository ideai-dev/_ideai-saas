# LLM Integration Guide

Complete guide for integrating multiple LLM providers and vector databases.

## Supported Providers

### LLM Providers
- **OpenAI**: GPT-4, GPT-4 Turbo, GPT-4o, GPT-5 (when available)
- **Anthropic**: Claude 3.5 Sonnet, Claude Opus 4.5
- **Google**: Gemini Pro, Gemini Ultra
- **Open Source**: Via Groq, Together AI, Replicate

### Vector Databases
- **Pinecone**: Managed vector database
- **ChromaDB**: Open-source, local/cloud
- **Qdrant**: High-performance vector search
- **pgvector**: PostgreSQL extension

---

## LLM Service Architecture

```
┌─────────────┐
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  LLM Service    │  Port 3003
│  (Node.js/TS)   │
└────────┬────────┘
         │
    ┌────┴────┬────────┬─────────┐
    ▼         ▼        ▼         ▼
┌────────┐ ┌────────┐ ┌───────┐ ┌────────┐
│ OpenAI │ │ Claude │ │Gemini │ │  Groq  │
└────────┘ └────────┘ └───────┘ └────────┘
```

---

## Quick Start

### 1. Set Up Environment Variables

```bash
# .env
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
GROQ_API_KEY=...

# Vector DBs
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-east-1
CHROMA_URL=http://localhost:8000
QDRANT_URL=http://localhost:6333
```

### 2. Start LLM Service

```bash
cd services/llm-service
pnpm install
pnpm dev
```

Service runs on `http://localhost:3003`

---

## API Endpoints

### Generate Text

**POST** `/api/generate`

```typescript
{
  "provider": "openai" | "anthropic" | "google",
  "model": "gpt-4o" | "claude-3-5-sonnet" | "gemini-pro",
  "prompt": "Your prompt here",
  "system": "System message (optional)",
  "temperature": 0.7,  // Optional, 0-2
  "maxTokens": 1000,   // Optional
  "stream": false      // Set true for streaming
}
```

**Response:**
```json
{
  "text": "Generated response...",
  "usage": {
    "promptTokens": 50,
    "completionTokens": 100,
    "totalTokens": 150
  },
  "finishReason": "stop"
}
```

### Chat with History

**POST** `/api/chat`

```typescript
{
  "provider": "openai",
  "model": "gpt-4o",
  "messages": [
    { "role": "user", "content": "Hello!" },
    { "role": "assistant", "content": "Hi there!" },
    { "role": "user", "content": "How are you?" }
  ],
  "temperature": 0.7,
  "maxTokens": 500
}
```

**Response:**
```json
{
  "message": {
    "role": "assistant",
    "content": "I'm doing great! How can I help you?"
  },
  "usage": { ... },
  "finishReason": "stop"
}
```

### Streaming Responses

Set `"stream": true` in the request:

```typescript
const response = await fetch('http://localhost:3003/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'openai',
    model: 'gpt-4o',
    prompt: 'Write a story',
    stream: true
  })
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  
  const chunk = decoder.decode(value)
  const lines = chunk.split('\n')
  
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = JSON.parse(line.slice(6))
      console.log(data.text) // Stream chunk
    }
  }
}
```

---

## Vector Database Service

### Architecture

```
┌─────────────┐
│ Vector DB   │  Port 3004
│  Service    │
└──────┬──────┘
       │
  ┌────┴────┬──────────┬─────────┐
  ▼         ▼          ▼         ▼
┌─────┐ ┌─────────┐ ┌────────┐ ┌──────────┐
│Chroma│ │Pinecone │ │Qdrant  │ │pgvector  │
└─────┘ └─────────┘ └────────┘ └──────────┘
```

### Start Service

```bash
cd services/vector-db
pnpm install
pnpm dev
```

### Insert Documents

**POST** `/api/insert`

```typescript
{
  "provider": "pinecone",
  "collection": "my_documents",
  "documents": [
    {
      "id": "doc1",
      "text": "Document content...",
      "metadata": { "title": "Document 1" },
      "embedding": [0.1, 0.2, ...]  // Optional, auto-generated if missing
    }
  ]
}
```

### Search Documents

**POST** `/api/search`

```typescript
{
  "provider": "pinecone",
  "collection": "my_documents",
  "query": "machine learning",  // Text query
  // OR
  "embedding": [0.1, 0.2, ...], // Vector query
  "limit": 10,
  "filter": { "category": "AI" }  // Optional metadata filter
}
```

**Response:**
```json
{
  "success": true,
  "provider": "pinecone",
  "collection": "my_documents",
  "results": [
    {
      "id": "doc1",
      "text": "...",
      "metadata": { ... },
      "score": 0.95
    }
  ]
}
```

### Create Collection

**POST** `/api/collections`

```typescript
{
  "provider": "pinecone",
  "name": "my_collection",
  "dimension": 1536,  // OpenAI embedding size
  "metadata": { "description": "..." }
}
```

### List Collections

**GET** `/api/collections?provider=pinecone`

---

## Model Context Protocol (MCP)

MCP enables LLMs to use tools and access context.

### Start MCP Service

```bash
cd services/mcp-service
pnpm install
pnpm dev
```

### Available Tools

1. **query_database** - Execute SQL queries
2. **vector_search** - Search vector databases
3. **execute_python** - Run Python code
4. **call_api** - Make HTTP requests

### Example: Tool Calling

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js'

const client = new Client({
  name: 'my-app',
  version: '1.0.0',
})

// Connect to MCP server
await client.connect()

// List available tools
const { tools } = await client.listTools()

// Call a tool
const result = await client.callTool({
  name: 'vector_search',
  arguments: {
    query: 'machine learning',
    collection: 'documents',
    limit: 5
  }
})

console.log(result)
```

---

## Complete Example: RAG System

Retrieval-Augmented Generation combining vector search + LLM.

### 1. Embed and Store Documents

```typescript
// Generate embeddings
const embeddingResponse = await fetch('http://localhost:3003/api/embeddings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'openai',
    model: 'text-embedding-3-large',
    texts: [
      'Machine learning is a subset of AI...',
      'Deep learning uses neural networks...'
    ]
  })
})

const { embeddings } = await embeddingResponse.json()

// Store in vector DB
await fetch('http://localhost:3004/api/insert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'pinecone',
    collection: 'knowledge_base',
    documents: [
      {
        id: 'doc1',
        text: 'Machine learning is a subset of AI...',
        embedding: embeddings[0],
        metadata: { source: 'textbook', page: 1 }
      },
      {
        id: 'doc2',
        text: 'Deep learning uses neural networks...',
        embedding: embeddings[1],
        metadata: { source: 'textbook', page: 2 }
      }
    ]
  })
})
```

### 2. Search + Generate

```typescript
async function askQuestion(question: string) {
  // 1. Search for relevant documents
  const searchResponse = await fetch('http://localhost:3004/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'pinecone',
      collection: 'knowledge_base',
      query: question,
      limit: 3
    })
  })

  const { results } = await searchResponse.json()
  
  // 2. Build context from results
  const context = results
    .map((r: any) => r.text)
    .join('\n\n')

  // 3. Generate answer using LLM
  const generateResponse = await fetch('http://localhost:3003/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'openai',
      model: 'gpt-4o',
      prompt: question,
      system: `Answer the question using only the following context:\n\n${context}`,
      temperature: 0.3
    })
  })

  const { text } = await generateResponse.json()
  return text
}

// Usage
const answer = await askQuestion('What is machine learning?')
console.log(answer)
```

---

## Provider-Specific Tips

### OpenAI
- Best for general tasks and reasoning
- GPT-4o is fastest, GPT-4 Turbo for complex tasks
- Use `gpt-4o-mini` for simple/cheap requests
- Embeddings: `text-embedding-3-large` (3072d) or `text-embedding-3-small` (1536d)

### Anthropic (Claude)
- Best for long context (200K tokens)
- Claude 3.5 Sonnet: Best balance
- Claude Opus: Most capable
- Excellent for analysis and writing

### Google (Gemini)
- Best for multimodal (text + images)
- Gemini Pro 1.5: 1M context window
- Good for code generation

### Vector Databases

**Pinecone**
- Fully managed, easiest to start
- Auto-scaling
- Best for production

**ChromaDB**
- Open source
- Good for development/prototyping
- Can run locally

**Qdrant**
- High performance
- Good for large-scale
- Self-hosted or cloud

**pgvector**
- Use existing PostgreSQL
- Good for simple cases
- No separate infrastructure

---

## Cost Optimization

### 1. Cache Responses
```typescript
import { Redis } from 'ioredis'

const redis = new Redis()

async function cachedGenerate(prompt: string) {
  const cacheKey = `llm:${hash(prompt)}`
  
  // Check cache
  const cached = await redis.get(cacheKey)
  if (cached) return JSON.parse(cached)
  
  // Generate
  const response = await fetch('http://localhost:3003/api/generate', {
    method: 'POST',
    body: JSON.stringify({ provider: 'openai', model: 'gpt-4o', prompt })
  })
  
  const data = await response.json()
  
  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(data))
  
  return data
}
```

### 2. Use Smaller Models
- Use `gpt-4o-mini` instead of `gpt-4o` when possible
- Use Claude Haiku for simple tasks
- Use Gemini Flash for speed

### 3. Batch Requests
- Process multiple items in one request
- Use embeddings API batch mode

### 4. Implement Rate Limiting
```typescript
import { RateLimiter } from 'limiter'

const limiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'minute'
})

await limiter.removeTokens(1)
// Now make API call
```

---

## Monitoring and Debugging

### Track Usage

```typescript
import { query } from '../database/src/pool'

async function logUsage(userId: string, provider: string, model: string, tokens: number) {
  await query(
    `INSERT INTO llm_usage (user_id, provider, model, tokens, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [userId, provider, model, tokens]
  )
}
```

### Error Handling

```typescript
async function robustGenerate(prompt: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch('http://localhost:3003/api/generate', {
        method: 'POST',
        body: JSON.stringify({ provider: 'openai', model: 'gpt-4o', prompt })
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      
      return await response.json()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error)
      if (i === maxRetries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i))) // Exponential backoff
    }
  }
}
```

---

## Next Steps

1. Review `/services/llm-service/README.md` for detailed setup
2. Check `/services/vector-db/README.md` for vector DB specifics
3. See `/services/mcp-service/README.md` for MCP implementation
4. Read `/docs/TEAM_GUIDE.md` for team-specific guidelines

## Support

- GitHub Issues for bugs
- GitHub Discussions for questions
- Team Slack for urgent matters

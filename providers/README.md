# Third-Party Providers

This directory contains all third-party service integrations organized by company. Each folder represents ONE external service provider you pay for.

## 📁 Directory Structure (Company-Based)

```
providers/
├── openai/              # OpenAI (GPT models, embeddings)
├── anthropic/           # Anthropic (Claude models)
├── google/              # Google Cloud (Vertex AI, Gemini)
├── aws/                 # Amazon Web Services (S3, Lambda, RDS)
├── vercel/              # Vercel Platform (Blob, KV, Postgres)
├── github/              # GitHub (API, webhooks, repos)
├── slack/               # Slack (messaging, bots)
├── stripe/              # Stripe (payments, subscriptions)
├── pinecone/            # Pinecone (vector database)
├── mcp/                 # MCP configurations (Claude Desktop, v0)
└── .env.example         # All provider credentials
```

## 🎯 Philosophy

**Your Services** (`/services/`) = Code you write and maintain with business logic
**Providers** (`/providers/`) = Thin SDK wrappers for external companies - NO business logic

## 📦 Current Providers

### AI/LLM Companies
- **openai/** - GPT-4, GPT-4o, o1, embeddings
- **anthropic/** - Claude 3.5 Sonnet, Opus
- **google/** - Vertex AI, Gemini 2.0

### Cloud Infrastructure
- **aws/** - S3, Lambda, RDS, DynamoDB
- **vercel/** - Blob, KV (Redis), Postgres, Edge Config

### Developer Tools
- **github/** - Repos, Actions, Issues, webhooks
- **mcp/** - Claude Desktop, v0, shadcn MCP configs

### Communication & Payments
- **slack/** - Messaging, notifications, bots
- **stripe/** - Payments, subscriptions, webhooks

### Data & Search
- **pinecone/** - Vector database for embeddings

## 🚀 Adding More Providers (Examples)

When you add new services, create folders for:
- **supabase/** - Auth, Postgres, Storage
- **sendgrid/** or **resend/** - Transactional email
- **qdrant/** or **weaviate/** - Alternative vector DBs
- **twilio/** - SMS and voice
- **sentry/** - Error tracking
- **datadog/** - Monitoring
- **sanity/** or **contentful/** - CMS

## 🔧 Usage Pattern

### Providers (Thin Wrappers)
```typescript
// providers/openai/client.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Just a thin wrapper - no business logic
export async function callGPT4(prompt: string) {
  return await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  })
}
```

### Services (Your Business Logic)
```typescript
// services/llm-service/src/router.ts
import { callGPT4 } from '@/providers/openai/client'
import { callClaude } from '@/providers/anthropic/client'

// Your custom routing logic
export async function routeToBestLLM(prompt: string) {
  if (prompt.length > 5000) return await callClaude(prompt)
  if (needsFastResponse) return await callGPT4(prompt)
  // Your business logic here
}
```

### Adding a New Provider

1. Create folder: `providers/[company-name]/`
2. Create `client.ts` with SDK initialization
3. Add env vars to `.env.example`
4. Document in this README
5. Import in your services (not in other providers)

## 🔐 Security

- Never commit `.env` files
- Use environment variables for all credentials
- Rotate API keys regularly
- Use least-privilege access principles
- Monitor usage and costs

## 📚 Documentation

Each provider directory contains:
- Configuration examples
- Authentication setup
- Usage patterns
- Rate limiting info
- Cost optimization tips

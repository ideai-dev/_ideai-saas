# Team Development Guide

Complete guide for all teams working on the monorepo.

## Table of Contents

1. [Frontend Team](#frontend-team)
2. [Python/FastAPI Team](#pythonfastapi-team)
3. [Node.js Services Team](#nodejs-services-team)
4. [Database Team](#database-team)
5. [DevOps Team](#devops-team)
6. [AI/ML Team](#aiml-team)

---

## Frontend Team

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: shadcn/ui + Tailwind CSS
- **State**: React Server Components + Client Components
- **Forms**: React Hook Form + Zod validation
- **API Calls**: Native fetch with SWR for caching

### Project Structure
```
apps/web/
├── app/                # App Router pages
│   ├── (auth)/        # Auth-protected routes
│   ├── api/           # API routes (proxy to backend)
│   └── layout.tsx     # Root layout
├── components/
│   ├── ui/            # shadcn components
│   └── features/      # Feature-specific components
├── lib/
│   ├── api.ts         # API client utilities
│   └── utils.ts       # Shared utilities
└── public/            # Static assets
```

### Getting Started

```bash
# Install dependencies
pnpm install

# Run dev server (port 3000)
pnpm dev

# Build for production
pnpm build
```

### API Integration

All API calls should go through the unified client:

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function callPythonAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}/python${endpoint}`, options)
  return response.json()
}

export async function callNodeAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE}/node${endpoint}`, options)
  return response.json()
}
```

### Best Practices
- Use Server Components by default, Client Components when needed
- Implement loading states with Suspense boundaries
- Use the `use cache` directive for expensive operations
- Follow shadcn/ui patterns for consistent styling
- Implement proper error boundaries

---

## Python/FastAPI Team

### Tech Stack
- **Framework**: FastAPI 0.115+
- **Validation**: Pydantic v2
- **Async**: asyncio + httpx
- **Database**: asyncpg for PostgreSQL
- **Testing**: pytest + pytest-asyncio

### Project Structure
```
services/api-python/
├── app/
│   ├── main.py           # FastAPI application
│   ├── routers/          # API route modules
│   │   ├── users.py
│   │   ├── documents.py
│   │   └── ai.py
│   ├── models/           # Pydantic models
│   ├── services/         # Business logic
│   ├── db/              # Database utilities
│   └── middleware/       # Custom middleware
├── tests/
├── requirements.txt
└── README.md
```

### Getting Started

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run dev server with hot reload (port 8000)
uvicorn app.main:app --reload --port 8000

# Run tests
pytest
```

### Example Route

```python
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1", tags=["example"])

class ItemCreate(BaseModel):
    name: str
    description: str | None = None

@router.post("/items")
async def create_item(item: ItemCreate):
    # Your logic here
    return {"id": "123", **item.model_dump()}
```

### Best Practices
- Use async/await for all I/O operations
- Implement dependency injection for database connections
- Use Pydantic v2 for request/response validation
- Add OpenAPI documentation with proper descriptions
- Implement proper error handling with HTTPException
- Use background tasks for long-running operations

### Database Access

```python
from app.db.pool import get_db_connection

async def get_user(user_id: str):
    async with get_db_connection() as conn:
        result = await conn.fetchrow(
            "SELECT * FROM users WHERE id = $1",
            user_id
        )
        return result
```

---

## Node.js Services Team

### Tech Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript with ES Modules
- **Database**: pg (PostgreSQL client)
- **Testing**: Vitest

### Project Structure
```
services/api-node/
├── src/
│   ├── index.ts          # Express app
│   ├── routes/           # API routes
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── utils/            # Utilities
├── tests/
├── package.json
└── tsconfig.json
```

### Getting Started

```bash
# Install dependencies
pnpm install

# Run dev server with watch mode (port 3002)
pnpm dev

# Build TypeScript
pnpm build

# Run tests
pnpm test
```

### Example Route

```typescript
import { Router } from 'express'
import { z } from 'zod'

const router = Router()

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

router.post('/users', async (req, res) => {
  try {
    const data = CreateUserSchema.parse(req.body)
    // Your logic here
    res.json({ success: true, data })
  } catch (error) {
    res.status(400).json({ error: 'Validation failed' })
  }
})

export default router
```

### Best Practices
- Use TypeScript strict mode
- Validate all inputs with Zod
- Use async/await, avoid callbacks
- Implement proper error middleware
- Use connection pooling for databases
- Add request logging with structured logs

---

## Database Team

### Tech Stack
- **Primary DB**: PostgreSQL 16
- **Vector DB**: pgvector extension (+ ChromaDB/Pinecone/Qdrant)
- **Cache**: Redis 7
- **ORM**: Drizzle ORM (optional, native SQL preferred)
- **Migrations**: Custom SQL scripts

### Schema Location
```
services/database/
├── schema.sql           # Main schema
├── migrations/          # Migration scripts
│   ├── 001_initial.sql
│   └── 002_add_vectors.sql
├── seeds/              # Seed data
└── src/
    └── pool.ts         # Connection pool
```

### Running Migrations

```bash
# Run all migrations
psql -U postgres -d monorepo_db -f services/database/schema.sql

# Run specific migration
psql -U postgres -d monorepo_db -f services/database/migrations/001_initial.sql
```

### Vector Search

The schema includes pgvector support for semantic search:

```sql
-- Search by embedding similarity
SELECT * FROM search_documents_by_embedding(
  '[0.1, 0.2, ...]'::vector(1536),  -- Query embedding
  0.8,                                -- Similarity threshold
  10                                  -- Max results
);
```

### Best Practices
- Always use prepared statements (parameterized queries)
- Implement connection pooling
- Use indexes appropriately
- Enable Row Level Security (RLS) where needed
- Use JSONB for flexible metadata
- Implement proper backup strategies
- Monitor query performance with EXPLAIN ANALYZE

### Connection Examples

**Python (asyncpg)**
```python
import asyncpg

pool = await asyncpg.create_pool(
    host='localhost',
    database='monorepo_db',
    user='postgres',
    password='password'
)
```

**Node.js (pg)**
```typescript
import pg from 'pg'

const pool = new pg.Pool({
  host: 'localhost',
  database: 'monorepo_db',
  user: 'postgres',
  password: 'password',
})
```

---

## DevOps Team

### Infrastructure

**Local Development**
- Docker Compose for all services
- Hot reload for all services
- Shared network for inter-service communication

**Production (AWS)**
- Frontend: Vercel (auto-deploy from git)
- Python API: AWS Lambda + API Gateway or ECS
- Node.js API: AWS Lambda + API Gateway or ECS
- Database: AWS RDS PostgreSQL
- Vector DB: Pinecone/AWS OpenSearch
- Cache: AWS ElastiCache Redis

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Rebuild specific service
docker-compose up -d --build api-python

# Stop all services
docker-compose down
```

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Lint all TypeScript/Python code
2. Run tests for all services
3. Build Docker images
4. Deploy to staging/production

### Monitoring
- **Logs**: CloudWatch or Datadog
- **Metrics**: Prometheus + Grafana
- **APM**: New Relic or Datadog APM
- **Errors**: Sentry

---

## AI/ML Team

### LLM Integration

Multiple providers supported:
- OpenAI (GPT-4, GPT-4o, GPT-5)
- Anthropic (Claude 3.5 Sonnet, Claude Opus)
- Google (Gemini Pro)
- Open source models via Groq/Together

### Services

**LLM Service** (`services/llm-service/`)
- Unified API for all LLM providers
- Request/response caching
- Rate limiting
- Token usage tracking

**Vector DB Service** (`services/vector-db/`)
- ChromaDB, Pinecone, Qdrant support
- Embedding generation
- Similarity search

**MCP Service** (`services/mcp-service/`)
- Model Context Protocol implementation
- Tool calling support
- Context management

### Example: Generate Text

```typescript
const response = await fetch('http://localhost:3003/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'openai',
    model: 'gpt-4o',
    prompt: 'Explain quantum computing',
    temperature: 0.7,
  })
})

const data = await response.json()
console.log(data.text)
```

### Example: Vector Search

```typescript
const response = await fetch('http://localhost:3004/api/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    provider: 'pinecone',
    collection: 'documents',
    query: 'machine learning papers',
    limit: 10,
  })
})

const { results } = await response.json()
```

### Best Practices
- Cache embeddings to reduce API costs
- Implement retry logic with exponential backoff
- Use streaming for better UX on long responses
- Monitor token usage and costs
- Implement rate limiting per user
- Store conversation history efficiently

---

## Development Workflow

### Branch Strategy
- `main` - Production
- `staging` - Staging environment
- `feature/*` - New features
- `fix/*` - Bug fixes

### Code Review Process
1. Create feature branch
2. Make changes with descriptive commits
3. Run tests locally
4. Create PR with description
5. Wait for CI checks
6. Get team review
7. Merge to staging first
8. Test in staging
9. Merge to main

### Communication
- Daily standups
- Slack channels per team
- GitHub Discussions for architecture decisions
- Shared documentation in `/docs`

---

## Environment Variables

See `.env.example` for all required variables.

### Shared Variables
```bash
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=monorepo_db
REDIS_URL=redis://localhost:6379
```

### Frontend Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### AI Service Variables
```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
PINECONE_API_KEY=...
```

---

## Support

- **Documentation**: `/docs` folder
- **Issues**: GitHub Issues
- **Questions**: GitHub Discussions
- **Emergency**: Slack #devops channel

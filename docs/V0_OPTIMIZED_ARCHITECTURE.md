# 2027 Full-Stack Monorepo
## Multi-Language SaaS Collective 3.0

**Purpose:** This guide shows your team how to structure Collective 3.0's Python/Rust/Node.js services to work perfectly with Vercel deployment and v0 AI assistant, while keeping all your current service architecture intact.

---

## 🎯 The Goal

✅ **Keep:** Your service directory, intelligence tags, FastAPI gateway, Python/Rust/Node services  
✅ **Add:** Turborepo structure, Next.js in `apps/web/`, v0-friendly patterns  
✅ **Deploy:** Next.js on Vercel (zero config), services on Railway/AWS  
✅ **Work with v0:** Perfect compatibility with v0's code generation and patterns

---

## 📁 Recommended Final Structure

```
_ideai-saas/                          # Root monorepo
├── apps/
│   ├── web/                          # ⭐ Next.js 16 (Vercel deployment)
│   │   ├── app/                      # App Router
│   │   ├── components/               # React components
│   │   ├── lib/                      # Client utilities
│   │   └── package.json
│   │
│   └── api/                          # ⭐ FastAPI Gateway (Railway/AWS)
│       ├── src/
│       │   └── collective_api/       # Your existing gateway
│       │       ├── modules/
│       │       │   ├── engine/       # Migrated from legacy
│       │       │   ├── graphql/      # Migrated from legacy
│       │       │   └── saga/         # Migrated from legacy
│       │       ├── core/             # Auth, config, errors
│       │       └── main.py
│       ├── pyproject.toml
│       └── README.md
│
├── services/                         # ⭐ Your multi-language services
│   ├── _service_directory/          # Source of truth (keep this!)
│   │   ├── README.md                 # 9 services with intelligence tags
│   │   ├── INTELLIGENCE_TAGS.md
│   │   ├── health/
│   │   ├── collective-engine-bff/
│   │   ├── graphql-mcp-api/
│   │   ├── saga-platform-api/
│   │   ├── voice-assistant/
│   │   ├── audio-transcription/
│   │   ├── social-x-scraper/
│   │   ├── content-policy-analysis/
│   │   └── integrations-backing/
│   │
│   ├── python/                       # Python microservices
│   │   ├── voice-service/           # Real-time voice (from voice-service-main)
│   │   ├── content-policy/          # Ixian content analysis (from ixian-main)
│   │   └── llm-router/              # Multi-LLM routing (new)
│   │
│   ├── nodejs/                       # Node.js microservices
│   │   ├── vector-db/               # Vector DB abstraction
│   │   ├── realtime-ws/             # WebSocket streaming
│   │   └── x-scraper/               # Twitter scraper (from x_scraper-main)
│   │
│   └── rust/                         # Rust microservices (future)
│       └── compute/                  # High-performance compute
│
├── providers/                        # ⭐ Third-party integrations
│   ├── openai/
│   │   ├── client.ts
│   │   └── README.md
│   ├── anthropic/
│   ├── stripe/
│   ├── pinecone/
│   ├── aws/
│   └── mcp/                         # Model Context Protocol
│       ├── claude-desktop.json
│       ├── v0.json
│       └── shadcn.json
│
├── packages/                         # ⭐ Shared code
│   ├── types/                       # TypeScript types
│   ├── config/                      # Shared configuration
│   ├── ui/                          # Shared React components
│   ├── ideai-reactflow/            # Your custom React Flow
│   └── python-shared/               # Shared Python utilities (new)
│
├── legacy/                          # Keep as-is
│   ├── api-graphql/
│   ├── api-engine/
│   └── api-saga/
│
├── docs/                            # Keep all your docs
│   ├── ARCHITECTURE.md
│   ├── MONOREPO_STRUCTURE.md
│   ├── TEAM_GUIDE.md
│   ├── V0_OPTIMIZED_ARCHITECTURE.md  # This file
│   └── ...
│
├── docker/                          # ⭐ Local development
│   ├── docker-compose.yml           # All services
│   ├── docker-compose.dev.yml       # Dev overrides
│   └── Dockerfile.template
│
├── turbo.json                       # ⭐ Turborepo config
├── pnpm-workspace.yaml              # ⭐ pnpm workspaces
├── package.json                     # Root scripts
└── README.md
```

---

## 🔑 Key Architecture Decisions

### 1. **Turborepo for Monorepo Management**

**Why:** Turborepo gives you intelligent caching, parallel execution, and perfect Vercel integration.

**Add:**
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": []
    }
  }
}
```

**Root package.json:**
```json
{
  "name": "ideai-saas",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "cd apps/api && uv run uvicorn collective_api.main:app --reload",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  },
  "packageManager": "pnpm@9.15.4",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/nodejs/*"
```

### 2. **Next.js in `apps/web/` - v0's Happy Place**

v0 expects and generates code for:
- Next.js App Router structure
- shadcn/ui components
- Server Components + Server Actions
- Tailwind CSS

**Create `apps/web/package.json`:**
```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.17",
    "typescript": "5.7.3"
  }
}
```

### 3. **FastAPI in `apps/api/` - Your Gateway**

Move your existing `api/` to `apps/api/` to match monorepo conventions.

**Keep your structure:**
- ✅ `collective_api` as the main app
- ✅ Modules for engine/graphql/saga
- ✅ Your auth contract
- ✅ uv/pip for Python dependencies

### 4. **Services by Language - Multi-Language Support**

Reorganize your existing services:

**From:**
```
services/
├── voice-service-main/
├── x_scraper-main/
├── ixian-main/
└── durden-main/
```

**To:**
```
services/
├── _service_directory/        # Keep as source of truth
├── python/
│   ├── voice-service/        # Renamed from voice-service-main
│   └── content-policy/       # Renamed from ixian-main
├── nodejs/
│   └── x-scraper/           # Renamed from x_scraper-main
└── rust/
    └── (future services)
```

Each service gets:
- Its own `Dockerfile`
- `README.md` with deployment info
- Health endpoint at `/health`
- Same error contract as gateway

### 5. **Providers for Third-Party APIs**

**Create `providers/` structure:**

```typescript
// providers/openai/client.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// providers/anthropic/client.ts
import Anthropic from '@anthropic-ai/sdk'

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
```

**Python providers:**
```python
# providers/openai/client.py
from openai import AsyncOpenAI

openai = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
```

### 6. **Shared Packages**

**TypeScript packages:**
```
packages/
├── types/              # Shared TypeScript types
│   ├── src/index.ts
│   └── package.json
├── config/             # Shared config
├── ui/                 # Shared React components
└── ideai-reactflow/    # Your existing React Flow package
```

**Python shared code:**
```
packages/
└── python-shared/
    ├── pyproject.toml
    └── src/
        ├── auth/       # Shared auth utilities
        ├── models/     # Shared Pydantic models
        └── errors/     # Shared error classes
```

---

## 🚀 Local Development Setup

### **One Command to Run Everything**

**`docker/docker-compose.yml`:**
```yaml
version: '3.8'

services:
  # Next.js Frontend
  web:
    build:
      context: ..
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    volumes:
      - ../apps/web:/app
    command: pnpm dev

  # FastAPI Gateway
  api:
    build:
      context: ..
      dockerfile: apps/api/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/ideai
      - REDIS_URL=redis://redis:6379
    volumes:
      - ../apps/api:/app
    command: uvicorn collective_api.main:app --host 0.0.0.0 --reload
    depends_on:
      - postgres
      - redis

  # Python Voice Service
  voice-service:
    build:
      context: ..
      dockerfile: services/python/voice-service/Dockerfile
    ports:
      - "8001:8001"
    environment:
      - API_GATEWAY_URL=http://api:8000
    command: uvicorn main:app --host 0.0.0.0 --port 8001

  # Node.js X Scraper
  x-scraper:
    build:
      context: ..
      dockerfile: services/nodejs/x-scraper/Dockerfile
    ports:
      - "8002:8002"
    environment:
      - API_GATEWAY_URL=http://api:8000
    command: node dist/index.js

  # Databases
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=ideai
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

**Run everything:**
```bash
# Start all services
cd docker
docker-compose up

# Or with Turborepo (just frontend + API)
pnpm dev

# Or individual services
pnpm dev:web        # Just Next.js
pnpm dev:api        # Just FastAPI
```

---

## ☁️ Production Deployment

### **Frontend: Vercel (Zero Config)**

1. Connect GitHub repo to Vercel
2. Vercel auto-detects `apps/web/`
3. Environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` → Railway API URL

**Deploy:** Push to main → Vercel deploys automatically ✨

### **Backend: Railway or AWS**

**Option A: Railway (Recommended for Fast Setup)**

Create 3 Railway apps:
1. **collective-api** (FastAPI gateway)
   - Set root directory: `apps/api/`
   - Port: 8000
   - Add PostgreSQL + Redis plugins

2. **voice-service** (Python)
   - Set root directory: `services/python/voice-service/`
   - Port: 8001

3. **x-scraper** (Node.js)
   - Set root directory: `services/nodejs/x-scraper/`
   - Port: 8002

**Option B: AWS**
- ECS/Fargate for services
- RDS for PostgreSQL
- ElastiCache for Redis
- ALB for load balancing

### **Environment Variables**

**Vercel (Next.js):**
```
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

**Railway (FastAPI):**
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
JWT_SECRET=...
```

**Railway (Services):**
```
API_GATEWAY_URL=https://your-api.railway.app
SERVICE_API_KEY=...
```

---

## 🤖 Working with v0

### **What v0 Loves**

✅ Next.js App Router in `apps/web/`  
✅ shadcn/ui components  
✅ TypeScript with strict types  
✅ Server Actions for mutations  
✅ Tailwind CSS for styling  
✅ React Hook Form + Zod for forms  

### **How v0 Understands Your Architecture**

When you ask v0 to build features, it will:
1. **Frontend code** → `apps/web/app/` (pages, components)
2. **API types** → `packages/types/` (shared between web + api)
3. **Server Actions** → `apps/web/app/actions/` (calls your FastAPI)
4. **Components** → `apps/web/components/` (shadcn/ui + custom)

### **Example v0 Prompt**

> "Build a chat interface that calls my FastAPI endpoint at `/api/v1/llm/chat` with streaming support"

v0 will generate:
- `apps/web/app/chat/page.tsx` (chat UI)
- `apps/web/components/chat-message.tsx` (message component)
- `apps/web/lib/api-client.ts` (API client with streaming)
- `packages/types/src/chat.ts` (shared types)

All following your architecture! 🎉

---

## 📋 Migration Checklist

### **Phase 1: Setup Monorepo Structure (1 week)**
- [ ] Add Turborepo (`turbo.json`, root `package.json`)
- [ ] Add `pnpm-workspace.yaml`
- [ ] Move existing Next.js to `apps/web/` (if exists)
- [ ] Move `api/` to `apps/api/`
- [ ] Create `providers/` folder
- [ ] Add shared `packages/types/`

### **Phase 2: Reorganize Services (1 week)**
- [ ] Create `services/python/`, `services/nodejs/`, `services/rust/`
- [ ] Move `voice-service-main` → `services/python/voice-service/`
- [ ] Move `ixian-main` → `services/python/content-policy/`
- [ ] Move `x_scraper-main` → `services/nodejs/x-scraper/`
- [ ] Keep `services/_service_directory/` as source of truth
- [ ] Update each service README with new location

### **Phase 3: Docker Compose (1 week)**
- [ ] Create `docker/docker-compose.yml`
- [ ] Add service for `apps/web/`
- [ ] Add service for `apps/api/`
- [ ] Add services for Python/Node services
- [ ] Add PostgreSQL, Redis
- [ ] Test: `docker-compose up` runs everything

### **Phase 4: Migrate Engine/GraphQL/Saga (2-3 weeks)**
- [ ] Migrate engine from `legacy/api-engine` to `apps/api/collective_api/modules/engine/`
- [ ] Migrate GraphQL from `legacy/api-graphql` to `modules/graphql/`
- [ ] Migrate Saga (in batches) from `legacy/api-saga` to `modules/saga/`
- [ ] Update `_service_directory` READMEs: "Implemented in collective_api"

### **Phase 5: Deploy (1 week)**
- [ ] Deploy Next.js to Vercel
- [ ] Deploy FastAPI to Railway/AWS
- [ ] Deploy services to Railway/AWS
- [ ] Configure environment variables
- [ ] Test production: web → api → services → databases

---

## 🎓 Team Guide by Role

### **Frontend Developers**
**Your workspace:** `apps/web/`

**Stack:**
- Next.js 16 with App Router
- React 19
- shadcn/ui + Tailwind CSS
- TypeScript 5.7

**How to work:**
```bash
# Run just frontend
pnpm dev:web

# Call backend API
import { apiClient } from '@/lib/api-client'
const data = await apiClient.post('/api/v1/llm/chat', { message })
```

**v0 integration:** Just paste your `apps/web/` structure into v0 and ask it to build features!

### **Python Developers**
**Your workspace:** `apps/api/` + `services/python/`

**Stack:**
- Python 3.12+
- FastAPI with async/await
- Pydantic v2
- uv for dependencies

**How to work:**
```bash
# Run API gateway
cd apps/api
uv run uvicorn collective_api.main:app --reload

# Run a Python service
cd services/python/voice-service
uv run uvicorn main:app --port 8001 --reload
```

**Adding a module to collective_api:**
```python
# apps/api/collective_api/modules/my_feature/router.py
from fastapi import APIRouter
router = APIRouter(prefix="/my-feature", tags=["my-feature"])

@router.get("/")
async def get_data():
    return {"data": "..."}
```

### **Node.js Developers**
**Your workspace:** `services/nodejs/`

**Stack:**
- Node.js 20+
- Express or Fastify
- TypeScript
- pnpm for dependencies

**How to work:**
```bash
# Run a Node.js service
cd services/nodejs/x-scraper
pnpm install
pnpm dev
```

**Service contract:**
```typescript
// Health endpoint (required)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' })
})

// Same error format as FastAPI
class ServiceError extends Error {
  constructor(public code: string, public status: number, message: string) {
    super(message)
  }
}
```

### **Rust Developers**
**Your workspace:** `services/rust/`

**Stack:**
- Rust stable
- Axum or Actix-web
- Tokio runtime
- Cargo for dependencies

**How to work:**
```bash
cd services/rust/compute
cargo run

# Build for production
cargo build --release
```

### **DevOps/Platform**
**Your responsibility:** Deployment, monitoring, infrastructure

**Read:**
- `docker/docker-compose.yml` (local setup)
- `apps/api/Dockerfile` (FastAPI image)
- Each service's `README.md` (deployment notes)

**Deploy:**
- Vercel: `apps/web/` (automatic via GitHub)
- Railway: `apps/api/` + services
- AWS: ECS/Fargate alternative

---

## 🔥 Key Differences from Generic v0 Template

| v0 Template | Your Architecture | Why Different |
|-------------|-------------------|---------------|
| Services are empty | Services are **documented and implemented** | You have real services (voice, x-scraper, ixian, durden) |
| Multiple microservices | **One gateway + modules** for core, separate services for standalones | Simpler deployment, shared auth/DB |
| Generic service names (llm-service, vector-db) | **Intelligence-tagged services** (01-20) | Better organization, clear capabilities |
| No legacy code | **`legacy/` folder** preserved | Historical reference during migration |
| Python only in API | **Python, Node.js, Rust services** | Best tool for each job |
| `providers/` assumed | Need to **create `providers/`** | Will consolidate third-party configs |

---

## ✅ Final Checklist: "Are We v0-Optimized?"

### **Monorepo Structure**
- [ ] Turborepo installed and configured
- [ ] pnpm workspaces set up
- [ ] `apps/web/` exists with Next.js 16
- [ ] `apps/api/` exists with FastAPI
- [ ] `services/python/`, `services/nodejs/`, `services/rust/` organized
- [ ] `packages/` for shared code
- [ ] `providers/` for third-party configs

### **Local Development**
- [ ] `docker-compose up` runs all services
- [ ] `pnpm dev` runs frontend + API
- [ ] All services have `/health` endpoints
- [ ] Environment variables documented

### **Production Deployment**
- [ ] Vercel connected to GitHub (auto-deploy `apps/web/`)
- [ ] Railway/AWS configured for `apps/api/`
- [ ] Railway/AWS configured for services
- [ ] Environment variables set in Vercel + Railway
- [ ] Monitoring/logging configured

### **v0 Compatibility**
- [ ] Next.js App Router structure
- [ ] shadcn/ui components installed
- [ ] TypeScript strict mode enabled
- [ ] API types shared in `packages/types/`
- [ ] Server Actions for mutations

### **Team Alignment**
- [ ] Team has read this document
- [ ] Roles clear (frontend/Python/Node/Rust/DevOps)
- [ ] Service directory updated with migration status
- [ ] `GETTING_ALL_OK.md` checklist tracked

---

## 🚀 Next Steps

**Week 1:** Set up monorepo structure (Turborepo, pnpm workspaces, `apps/`, `services/`)

**Week 2:** Create Docker Compose for local development

**Week 3-5:** Migrate engine/GraphQL/Saga to `apps/api/collective_api/modules/`

**Week 6:** Deploy to production (Vercel + Railway)

**Ongoing:** Use v0 to build frontend features in `apps/web/` 🎉

---

## 📚 Additional Resources

- **Your docs:** `api/docs/GETTING_ALL_OK.md`, `services/_service_directory/README.md`
- **Turborepo:** https://turbo.build/repo/docs
- **Next.js 16:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs
- **Railway:** https://docs.railway.app
- **v0:** https://v0.dev

---

**Summary:** This architecture gives you the best of both worlds—your proven service patterns with intelligence tags and multi-language support, plus v0/Vercel's seamless developer experience. Your team can continue building services in Python/Rust/Node.js while frontend devs get instant v0 AI assistance. Perfect for scaling from MVP to enterprise SaaS with AI capabilities.

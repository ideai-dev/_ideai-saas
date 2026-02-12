# 2027 Full-Stack Monorepo Migration Plan
## Multi-Language SaaS Collective 3.0

**Goal:** Transform Collective 3.0's current architecture into a v0/Vercel-optimized monorepo while keeping all your existing services, intelligence tags, and Python/Rust/Node.js flexibility.

**Timeline:** 4-6 weeks (depending on team size and complexity)

---

## 🎯 Before & After

### **Current Structure (What You Have)**
```
_ideai-saas/
├── api/                    # FastAPI (not under apps/)
│   └── src/collective_api/
├── services/               # Services not organized by language
│   ├── _service_directory/ # ✅ Keep this!
│   ├── voice-service-main/
│   ├── x_scraper-main/
│   ├── ixian-main/
│   └── durden-main/
├── legacy/                 # ✅ Keep this!
├── docs/                   # ✅ Keep this!
├── packages/               # Some TypeScript packages
└── providers/              # MCP configs only
```

### **Target Structure (v0-Optimized)**
```
_ideai-saas/
├── apps/
│   ├── web/               # ⭐ NEW: Next.js 16
│   └── api/               # ⭐ MOVED: Your FastAPI
├── services/
│   ├── _service_directory/ # ✅ KEEP
│   ├── python/            # ⭐ NEW: Organized by language
│   ├── nodejs/
│   └── rust/
├── providers/             # ⭐ EXPANDED: All third-party
├── packages/              # ⭐ EXPANDED: More shared code
├── docker/                # ⭐ NEW: Local dev
├── legacy/                # ✅ KEEP
├── docs/                  # ✅ KEEP
├── turbo.json             # ⭐ NEW
└── pnpm-workspace.yaml    # ⭐ NEW
```

---

## 📋 Migration Phases

---

## **Phase 1: Monorepo Foundation** (Week 1)
**Goal:** Add Turborepo and workspace structure without moving existing code

### 1.1 Add Turborepo

**Install dependencies:**
```bash
# In root
pnpm add -D turbo
```

**Create `turbo.json`:**
```json
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
      "dependsOn": ["^lint"],
      "outputs": []
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

**Update root `package.json`:**
```json
{
  "name": "ideai-saas",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "type-check": "turbo run type-check"
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

**Create `pnpm-workspace.yaml`:**
```yaml
packages:
  - "apps/*"
  - "packages/*"
  - "services/nodejs/*"
```

### 1.2 Create `apps/` Structure

**Create directories:**
```bash
mkdir -p apps/web
mkdir -p apps/api
```

✅ **Checkpoint:** You now have Turborepo set up. Nothing is broken because we haven't moved code yet.

---

## **Phase 2: Move Next.js to `apps/web/`** (Week 1)
**Goal:** If you have existing Next.js code, move it. Otherwise, create a fresh Next.js 16 app.

### 2.1 Option A: Move Existing Next.js

**If you have Next.js at root:**
```bash
# Move all Next.js files to apps/web/
mv app/ apps/web/
mv components/ apps/web/
mv lib/ apps/web/
mv public/ apps/web/
mv styles/ apps/web/

# Move Next.js configs
mv next.config.* apps/web/
mv tailwind.config.* apps/web/
mv tsconfig.json apps/web/
mv postcss.config.* apps/web/

# Update package.json
# (See below)
```

### 2.2 Option B: Create New Next.js App

```bash
cd apps/
pnpm create next-app@latest web \
  --typescript \
  --tailwind \
  --app \
  --turbopack \
  --src-dir=false \
  --import-alias="@/*"
```

**Install shadcn/ui:**
```bash
cd apps/web
pnpm dlx shadcn@latest init

# Add commonly used components
pnpm dlx shadcn@latest add button
pnpm dlx shadcn@latest add card
pnpm dlx shadcn@latest add input
pnpm dlx shadcn@latest add form
pnpm dlx shadcn@latest add toast
pnpm dlx shadcn@latest add dialog
```

### 2.3 Configure `apps/web/package.json`

```json
{
  "name": "web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@types/node": "^22",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "typescript": "5.7.3",
    "tailwindcss": "^3.4.17",
    "@radix-ui/react-*": "latest",
    "lucide-react": "latest",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

### 2.4 Test

```bash
# From root
pnpm dev --filter=web

# Or from apps/web
cd apps/web
pnpm dev
```

✅ **Checkpoint:** Next.js runs in `apps/web/` at `localhost:3000`

---

## **Phase 3: Move FastAPI to `apps/api/`** (Week 1-2)
**Goal:** Move your existing `api/` folder to `apps/api/` and ensure it still works

### 3.1 Move the Folder

```bash
# Move api/ to apps/api/
mv api/ apps/api/
```

### 3.2 Update Python Imports (if needed)

If you have absolute imports like `from collective_api.core import ...`, they should still work because the module is `collective_api` inside `src/`.

**Check `pyproject.toml`:**
```toml
[project]
name = "collective-api"
version = "0.1.0"
description = "Collective API Gateway"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.32.0",
    "pydantic>=2.9.0",
    "pydantic-settings>=2.5.0",
    # ... your dependencies
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/collective_api"]
```

### 3.3 Update Root Scripts

**Update root `package.json` to include FastAPI:**
```json
{
  "scripts": {
    "dev": "turbo run dev",
    "dev:web": "turbo run dev --filter=web",
    "dev:api": "cd apps/api && uv run uvicorn collective_api.main:app --host 0.0.0.0 --port 8000 --reload",
    "dev:all": "concurrently \"pnpm dev:web\" \"pnpm dev:api\""
  },
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
```

### 3.4 Test

```bash
# From root
pnpm dev:api

# Should start FastAPI at localhost:8000
```

✅ **Checkpoint:** FastAPI runs in `apps/api/` at `localhost:8000`

---

## **Phase 4: Reorganize Services by Language** (Week 2)
**Goal:** Move existing services from flat structure to `python/`, `nodejs/`, `rust/`

### 4.1 Create Language Folders

```bash
mkdir -p services/python
mkdir -p services/nodejs
mkdir -p services/rust
```

### 4.2 Move Python Services

```bash
# voice-service-main → services/python/voice-service
mv services/voice-service-main services/python/voice-service

# ixian-main → services/python/content-policy
mv services/ixian-main services/python/content-policy

# Add others as needed
```

### 4.3 Move Node.js Services

```bash
# x_scraper-main → services/nodejs/x-scraper
mv services/x_scraper-main services/nodejs/x-scraper
```

### 4.4 Update `_service_directory` READMEs

For each service, update its README to show new location:

**Example: `services/_service_directory/voice-assistant/README.md`:**
```markdown
# Voice Assistant

**Status:** ✅ Implemented  
**Location:** `services/python/voice-service/`  
**Port:** 8001  
**Intelligence Tags:** 01 Language, 08 Interactive

## Endpoints
- `GET /health` - Health check
- `POST /transcribe` - Audio transcription
- `WS /voice` - Real-time voice streaming

## Run Locally
```bash
cd services/python/voice-service
uv run uvicorn main:app --port 8001 --reload
```

## Docker
```bash
docker build -t voice-service -f services/python/voice-service/Dockerfile .
docker run -p 8001:8001 voice-service
```
```

### 4.5 Update Service Imports

**If services import from each other**, update paths:

**Before:**
```python
# In services/ixian-main/something.py
from voice_service_main.utils import helper
```

**After:**
```python
# In services/python/content-policy/something.py
from voice_service.utils import helper
```

✅ **Checkpoint:** All services are organized by language in `services/{python,nodejs,rust}/`

---

## **Phase 5: Expand `providers/`** (Week 2-3)
**Goal:** Move all third-party integrations to `providers/`

### 5.1 Create Provider Structure

```bash
mkdir -p providers/{openai,anthropic,groq,stripe,aws,pinecone,supabase}
```

### 5.2 Move Integrations from Saga

**Current:** `legacy/api-saga/integrations/`
- Email (SendGrid, Mailgun)
- Storage (S3, local)
- LLM client
- AV scanner

**Move to:**
- `providers/sendgrid/`
- `providers/aws/s3.py`, `providers/aws/s3.ts`
- `providers/openai/`, `providers/anthropic/`
- `providers/clamav/`

**Example: `providers/openai/client.py`:**
```python
import os
from openai import AsyncOpenAI

client = AsyncOpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
)

async def chat_completion(messages: list[dict], model: str = "gpt-4"):
    response = await client.chat.completions.create(
        model=model,
        messages=messages,
    )
    return response.choices[0].message.content
```

**Example: `providers/openai/client.ts`:**
```typescript
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function chatCompletion(messages: any[], model = 'gpt-4') {
  const response = await openai.chat.completions.create({
    model,
    messages,
  })
  return response.choices[0].message.content
}
```

### 5.3 Add Provider READMEs

**Example: `providers/openai/README.md`:**
```markdown
# OpenAI Provider

Unified OpenAI client configuration for both Python and TypeScript.

## Setup
1. Get API key from https://platform.openai.com/api-keys
2. Add to `.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```

## Usage

**Python:**
```python
from providers.openai.client import chat_completion
result = await chat_completion([{"role": "user", "content": "Hello"}])
```

**TypeScript:**
```typescript
import { chatCompletion } from '@/providers/openai/client'
const result = await chatCompletion([{role: 'user', content: 'Hello'}])
```

## Models Available
- `gpt-4o` - Fastest, multimodal
- `gpt-4-turbo` - Advanced reasoning
- `gpt-3.5-turbo` - Cost-effective
```

✅ **Checkpoint:** All third-party integrations are in `providers/` with both Python and TypeScript clients

---

## **Phase 6: Docker Compose for Local Dev** (Week 3)
**Goal:** One command to run all services locally

### 6.1 Create `docker/` Folder

```bash
mkdir -p docker
```

### 6.2 Create `docker/docker-compose.yml`

```yaml
version: '3.8'

services:
  # Next.js Frontend
  web:
    build:
      context: ..
      dockerfile: docker/Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    volumes:
      - ../apps/web:/app
      - /app/node_modules
      - /app/.next
    command: pnpm dev --turbo

  # FastAPI Gateway
  api:
    build:
      context: ..
      dockerfile: docker/Dockerfile.api
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://ideai:ideai@postgres:5432/ideai
      - REDIS_URL=redis://redis:6379/0
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    volumes:
      - ../apps/api:/app
    command: uvicorn collective_api.main:app --host 0.0.0.0 --port 8000 --reload
    depends_on:
      - postgres
      - redis

  # Python: Voice Service
  voice-service:
    build:
      context: ..
      dockerfile: services/python/voice-service/Dockerfile
    ports:
      - "8001:8001"
    environment:
      - API_GATEWAY_URL=http://api:8000
      - REDIS_URL=redis://redis:6379/1
    volumes:
      - ../services/python/voice-service:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8001 --reload
    depends_on:
      - redis

  # Python: Content Policy (Ixian)
  content-policy:
    build:
      context: ..
      dockerfile: services/python/content-policy/Dockerfile
    ports:
      - "8002:8002"
    environment:
      - API_GATEWAY_URL=http://api:8000
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ../services/python/content-policy:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8002 --reload

  # Node.js: X Scraper
  x-scraper:
    build:
      context: ..
      dockerfile: services/nodejs/x-scraper/Dockerfile
    ports:
      - "8003:8003"
    environment:
      - API_GATEWAY_URL=http://api:8000
      - REDIS_URL=redis://redis:6379/2
      - BRIGHTDATA_API_KEY=${BRIGHTDATA_API_KEY}
    volumes:
      - ../services/nodejs/x-scraper:/app
      - /app/node_modules
    command: pnpm dev

  # PostgreSQL with pgvector
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=ideai
      - POSTGRES_PASSWORD=ideai
      - POSTGRES_DB=ideai
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ideai"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  postgres_data:
  redis_data:
```

### 6.3 Create Dockerfiles

**`docker/Dockerfile.web`:**
```dockerfile
FROM node:20-alpine AS base
RUN npm install -g pnpm@9.15.4
WORKDIR /app

COPY apps/web/package.json apps/web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY apps/web ./
EXPOSE 3000
CMD ["pnpm", "dev"]
```

**`docker/Dockerfile.api`:**
```dockerfile
FROM python:3.12-slim AS base
WORKDIR /app

# Install uv
RUN pip install uv

# Copy dependency files
COPY apps/api/pyproject.toml apps/api/uv.lock* ./
RUN uv sync --frozen

# Copy source code
COPY apps/api/src ./src

EXPOSE 8000
CMD ["uv", "run", "uvicorn", "collective_api.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 6.4 Create `.env` File

**`docker/.env.example`:**
```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Groq
GROQ_API_KEY=gsk_...

# BrightData (for X scraper)
BRIGHTDATA_API_KEY=...

# JWT
JWT_SECRET=your-super-secret-key

# Environment
ENV=development
```

### 6.5 Run Everything

```bash
cd docker
cp .env.example .env
# Edit .env with your API keys

docker-compose up
```

**Services available:**
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000
- Voice Service: http://localhost:8001
- Content Policy: http://localhost:8002
- X Scraper: http://localhost:8003
- PostgreSQL: localhost:5432
- Redis: localhost:6379

✅ **Checkpoint:** `docker-compose up` starts your entire stack

---

## **Phase 7: Migrate Engine/GraphQL/Saga** (Week 3-5)
**Goal:** Move functionality from `legacy/` into `apps/api/collective_api/modules/`

This is the longest phase. Follow your existing `api/docs/GETTING_ALL_OK.md` checklist.

### 7.1 Create Module Structure

```bash
cd apps/api/src/collective_api
mkdir -p modules/{engine,graphql,saga}
```

### 7.2 Migrate Engine (Week 3)

**From:** `legacy/api-engine/` + `services/durden-main/`  
**To:** `apps/api/src/collective_api/modules/engine/`

**Steps:**
1. Copy route handlers from `legacy/api-engine/routes/`
2. Adapt to FastAPI patterns (async, Pydantic models)
3. Register routes in `modules/engine/router.py`
4. Add to `collective_api/main.py`:
   ```python
   from collective_api.modules.engine.router import router as engine_router
   app.include_router(engine_router, prefix="/api/engine", tags=["engine"])
   ```

**Test:**
```bash
curl http://localhost:8000/api/engine/process
curl http://localhost:8000/api/engine/event
```

### 7.3 Migrate GraphQL (Week 4)

**From:** `legacy/api-graphql/`  
**To:** `apps/api/src/collective_api/modules/graphql/`

**Install dependencies:**
```bash
cd apps/api
uv add strawberry-graphql[fastapi]
```

**Create schema:**
```python
# modules/graphql/schema.py
import strawberry
from fastapi import Depends
from collective_api.core.auth import CurrentUser, get_current_user

@strawberry.type
class Query:
    @strawberry.field
    async def me(self, info, user: CurrentUser = Depends(get_current_user)) -> str:
        return f"Hello {user.username}"

schema = strawberry.Schema(query=Query)
```

**Create router:**
```python
# modules/graphql/router.py
from fastapi import APIRouter
from strawberry.fastapi import GraphQLRouter
from .schema import schema

router = APIRouter()
graphql_router = GraphQLRouter(schema, path="/graphql")
router.include_router(graphql_router)
```

**Add to main:**
```python
from collective_api.modules.graphql.router import router as graphql_router
app.include_router(graphql_router, prefix="/api", tags=["graphql"])
```

### 7.4 Migrate Saga (Week 4-5)

**From:** `legacy/api-saga/` (22 features)  
**To:** `apps/api/src/collective_api/modules/saga/`

**Strategy:** Migrate in batches by priority:

**Batch 1 (High Priority):**
- Auth (login, register, sessions)
- Users (CRUD)
- File management

**Batch 2 (Medium Priority):**
- Activities
- Lessons
- AI tools (chat, completions)

**Batch 3 (Low Priority):**
- Webhooks
- Analytics
- Admin features

**For each feature:**
1. Copy models from `legacy/api-saga/models/`
2. Adapt to Pydantic v2
3. Copy routes, adapt to FastAPI
4. Add to `modules/saga/features/{auth,users,files}/router.py`
5. Test endpoints

### 7.5 Update `_service_directory` Status

After each migration, update the service README:

**Example: `services/_service_directory/collective-engine-bff/README.md`:**
```markdown
# Collective Engine BFF

**Status:** ✅ Migrated to collective_api  
**Location:** `apps/api/src/collective_api/modules/engine/`  
**Endpoints:** `/api/engine/*`

## Available Endpoints
- `POST /api/engine/process` - Process a workflow
- `POST /api/engine/event` - Send an event
- `GET /api/engine/preview/{id}` - Preview result
- `GET /api/engine/history` - Get history
- `WS /api/engine/stream` - Stream updates

## Migration Notes
- Migrated from `legacy/api-engine/` in Week 3
- All tests passing ✅
- Backward compatible with old client code
```

✅ **Checkpoint:** Engine, GraphQL, and Saga are modules in `apps/api/collective_api/modules/`

---

## **Phase 8: Production Deployment** (Week 6)
**Goal:** Deploy to Vercel (frontend) and Railway (backend + services)

### 8.1 Deploy Next.js to Vercel

**Steps:**
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import your repository
4. Vercel auto-detects `apps/web/`
5. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-api.railway.app`
6. Deploy! ✨

**Vercel config (optional) - `vercel.json` in root:**
```json
{
  "buildCommand": "cd apps/web && pnpm build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

### 8.2 Deploy FastAPI to Railway

**Steps:**
1. Go to https://railway.app
2. New Project → Deploy from GitHub Repo
3. Select your repo
4. Add Service: **collective-api**
   - Root Directory: `apps/api/`
   - Build Command: `pip install uv && uv sync`
   - Start Command: `uv run uvicorn collective_api.main:app --host 0.0.0.0 --port $PORT`
   - Port: 8000
5. Add PostgreSQL plugin (Railway provides)
6. Add Redis plugin
7. Add environment variables:
   - `DATABASE_URL` (auto from Railway)
   - `REDIS_URL` (auto from Railway)
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `JWT_SECRET`
8. Deploy!

**Get your API URL:** `https://collective-api-production.up.railway.app`

### 8.3 Deploy Python Services to Railway

Repeat for each service (voice-service, content-policy):

1. New Service in same project
2. Root Directory: `services/python/voice-service/`
3. Build Command: `pip install uv && uv sync`
4. Start Command: `uv run uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `API_GATEWAY_URL` = URL of your collective-api
   - Service-specific keys
6. Deploy!

### 8.4 Deploy Node.js Services to Railway

For x-scraper:

1. New Service
2. Root Directory: `services/nodejs/x-scraper/`
3. Build Command: `pnpm install`
4. Start Command: `pnpm start`
5. Add environment variables
6. Deploy!

### 8.5 Update Frontend API URL

In Vercel dashboard, set:
```
NEXT_PUBLIC_API_URL=https://collective-api-production.up.railway.app
```

Redeploy frontend to pick up new URL.

✅ **Checkpoint:** Everything is deployed and working in production!

---

## 🎓 Post-Migration Checklist

### **Structure**
- [ ] `apps/web/` contains Next.js 16
- [ ] `apps/api/` contains FastAPI gateway
- [ ] `services/python/` contains Python services
- [ ] `services/nodejs/` contains Node.js services
- [ ] `services/rust/` exists (even if empty)
- [ ] `providers/` contains all third-party integrations
- [ ] `packages/` contains shared TypeScript + Python code
- [ ] `legacy/` preserved for reference
- [ ] `docs/` updated with new structure

### **Development**
- [ ] `turbo.json` configured
- [ ] `pnpm-workspace.yaml` includes all apps/packages
- [ ] `docker-compose up` runs entire stack
- [ ] `pnpm dev` runs frontend
- [ ] `pnpm dev:api` runs FastAPI
- [ ] All services have health checks at `/health`

### **Migration**
- [ ] Engine migrated to `modules/engine/`
- [ ] GraphQL migrated to `modules/graphql/`
- [ ] Saga migrated to `modules/saga/` (or in progress)
- [ ] `_service_directory` READMEs updated with new locations
- [ ] All imports updated
- [ ] All tests passing

### **Deployment**
- [ ] Frontend deployed to Vercel
- [ ] FastAPI deployed to Railway/AWS
- [ ] Python services deployed
- [ ] Node.js services deployed
- [ ] Environment variables set in Vercel
- [ ] Environment variables set in Railway
- [ ] Health checks passing
- [ ] Monitoring/logging configured

### **Documentation**
- [ ] `V0_OPTIMIZED_ARCHITECTURE.md` reflects reality
- [ ] `MIGRATION_TO_V0_STRUCTURE.md` marked as complete
- [ ] Team guide updated for new structure
- [ ] README.md updated
- [ ] Service directory updated

### **v0 Compatibility**
- [ ] v0 can generate code in `apps/web/app/`
- [ ] v0 understands your API at `apps/api/`
- [ ] Shared types work between frontend/backend
- [ ] shadcn/ui components installed
- [ ] Tailwind configured

---

## 🚨 Common Migration Issues

### **Issue: Import Errors After Moving Code**

**Problem:** `ImportError: No module named 'collective_api'`

**Solution:** Check your Python path and ensure `pyproject.toml` has:
```toml
[tool.hatch.build.targets.wheel]
packages = ["src/collective_api"]
```

### **Issue: Docker Build Fails**

**Problem:** `ERROR: failed to solve: failed to compute cache key`

**Solution:** Make sure your `.dockerignore` includes:
```
node_modules
.next
__pycache__
*.pyc
.venv
dist
build
```

### **Issue: Frontend Can't Connect to API**

**Problem:** CORS errors in browser console

**Solution:** Add CORS middleware to FastAPI:
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Issue: Railway Build Fails**

**Problem:** `No such file or directory: pyproject.toml`

**Solution:** Set correct root directory in Railway service settings:
- For API: `apps/api/`
- For services: `services/python/voice-service/`

---

## 📊 Progress Tracking

Use this table to track your migration:

| Phase | Tasks | Status | Week | Notes |
|-------|-------|--------|------|-------|
| 1. Monorepo Foundation | Add Turborepo, pnpm workspaces | ⬜ | 1 | |
| 2. Move Next.js | Create/move to `apps/web/` | ⬜ | 1 | |
| 3. Move FastAPI | Move to `apps/api/` | ⬜ | 1-2 | |
| 4. Reorganize Services | Organize by language | ⬜ | 2 | |
| 5. Expand Providers | Move integrations to `providers/` | ⬜ | 2-3 | |
| 6. Docker Compose | Create local dev environment | ⬜ | 3 | |
| 7. Migrate Engine | Move to `modules/engine/` | ⬜ | 3 | |
| 8. Migrate GraphQL | Move to `modules/graphql/` | ⬜ | 4 | |
| 9. Migrate Saga | Move to `modules/saga/` (batches) | ⬜ | 4-5 | |
| 10. Deploy | Vercel + Railway | ⬜ | 6 | |

---

## 🎉 Success Criteria

You know the migration is complete when:

1. ✅ `pnpm dev` starts Next.js frontend
2. ✅ `pnpm dev:api` starts FastAPI gateway
3. ✅ `docker-compose up` runs entire stack locally
4. ✅ Frontend deploys to Vercel with one click
5. ✅ Backend deploys to Railway with one click
6. ✅ v0 can generate features in `apps/web/` seamlessly
7. ✅ All 9 services documented in `_service_directory` are implemented or migrated
8. ✅ Your team can work in Python, Node.js, or Rust independently
9. ✅ Legacy code preserved in `legacy/` for reference
10. ✅ Zero confusion about where new code goes

---

## 📞 Need Help?

**Stuck on a phase?** Check these resources:
- **Turborepo docs:** https://turbo.build/repo/docs
- **Railway docs:** https://docs.railway.app
- **Your existing docs:** `api/docs/GETTING_ALL_OK.md`, `EXTENDING.md`

**Questions about architecture?** Re-read:
- `V0_OPTIMIZED_ARCHITECTURE.md` (this guide's companion)
- `ARCHITECTURE_MAPPING_FOR_TEAM.md`

---

**Summary:** This migration takes 4-6 weeks but gives you a world-class monorepo structure that works perfectly with Vercel, v0, and your team's multi-language services. After completion, your team will have: zero-friction frontend deployment, organized microservices, shared code in `packages/`, all third-party integrations in `providers/`, and a single `docker-compose up` command that runs everything locally. You'll keep all your intelligence tags, service directory, and Python/Rust/Node.js flexibility while gaining v0's AI-powered code generation for your Next.js frontend.

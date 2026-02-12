# Architecture Decision Records (ADR)

This document explains key architectural decisions for the 2027 monorepo.

## Decision 1: FastAPI as Single API Gateway

**Status**: Accepted  
**Date**: 2026  

### Context
We need to decide between:
- Multiple APIs (FastAPI for Python + Node.js/Express for JavaScript)
- Single API gateway

### Decision
Use **FastAPI only** as the single API gateway.

### Rationale
1. **Next.js 16 RSC** handles all Node.js/JavaScript logic via Server Components and Server Actions
2. **AI/ML dominance** in 2027 requires Python - FastAPI is async and performant
3. **Simpler DevOps** - one deployment, one monitoring stack, one API
4. **FastAPI async performance** rivals Node.js for most workloads

### Consequences
- **Positive**: Clearer architecture, easier onboarding, Python-first for AI
- **Negative**: Team needs Python expertise (mitigated by strong typing with Pydantic)
- **Migration**: If real-time needs arise (WebSockets/SSE), can add Node service later

---

## Decision 2: Provider vs Service Separation

**Status**: Accepted  
**Date**: 2026  

### Context
Need clear separation between:
- External third-party services we pay for
- Internal business logic we write

### Decision
```
/providers/[company-name]/    # External paid services (thin SDK wrappers)
/services/[service-name]/      # Internal business logic (imports providers)
```

### Rationale
1. **Clarity**: One folder per company makes it obvious what's external
2. **Maintainability**: Swap providers without rewriting services
3. **No duplication**: Provider code centralized, not repeated in services
4. **Onboarding**: New devs immediately understand what they own vs rent

### Examples
```typescript
// providers/openai/client.ts - Just SDK initialization
export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// services/llm-service/ - YOUR routing logic
import { openai } from '@/providers/openai/client'
import { anthropic } from '@/providers/anthropic/client'
export function routeLLM(prompt) { /* custom logic */ }
```

---

## Decision 3: Cache Strategy - Next.js + Redis

**Status**: Accepted  
**Date**: 2026  

### Context
2027 offers multiple caching solutions:
- Next.js built-in cache with `use cache`
- Redis for distributed caching
- CDN/Edge caching
- Database query caching

### Decision
Two-tier caching:
1. **Next.js Cache (Primary)** - Use `use cache` directive with `cacheLife` profiles for UI data
2. **Redis (API Layer)** - FastAPI uses Redis for LLM responses, rate limiting, sessions

### Rationale
1. **Keep It Simple**: Don't over-engineer with 5 cache layers
2. **Next.js Cache is Production-Ready**: Built-in, fast, works with RSC
3. **Redis for Expensive Ops**: LLM calls cost money/time - cache aggressively
4. **Separation of Concerns**: UI caching ≠ API caching

### Implementation
```typescript
// Next.js - UI caching
'use cache'
export async function getDashboard() {
  // Cached with Next.js
}

// FastAPI - API caching
@cache_with_redis(ttl=3600)
async def generate_llm_response(prompt: str):
    # Cached in Redis
```

---

## Decision 4: Database Access via FastAPI Only

**Status**: Accepted  
**Date**: 2026  

### Context
Where should database access logic live?
- Distributed across services?
- In a dedicated database service?
- In the API gateway?

### Decision
All database access (PostgreSQL, Redis) lives in **`apps/api/`** (FastAPI).

### Rationale
1. **Single Source of Truth**: One place for all DB queries, migrations, models
2. **Transaction Management**: FastAPI handles complex transactions centrally
3. **Security**: Database credentials only in one service
4. **Next.js RSC**: Can call FastAPI directly from Server Components when needed

### Structure
```
apps/api/
├── app/db/          # SQLAlchemy models, sessions
├── alembic/         # Database migrations
└── app/api/v1/      # Endpoints that use DB
```

---

## Decision 5: Remove Node.js API Service

**Status**: Accepted  
**Date**: 2026  

### Context
Initial design had both FastAPI and Node.js API services.

### Decision
**Remove** `services/api-node/` - use FastAPI only.

### Rationale
- Next.js 16 handles all Node/JS logic via RSC and Server Actions
- FastAPI is sufficient for API gateway needs
- Reduces complexity and deployment overhead
- Can add back later if specific Node.js requirements emerge

### Consequences
- Moved to `_delete/api-node/` for reference
- Team focuses on Python for backend services

---

## Future Decisions to Document

When making architectural changes, document here:
- Choice of vector database (if Pinecone is replaced)
- Real-time communication approach (if WebSockets needed)
- Authentication strategy (when implemented)
- API versioning approach (v2 requirements)
- Monorepo tool changes (if moving from Turborepo)

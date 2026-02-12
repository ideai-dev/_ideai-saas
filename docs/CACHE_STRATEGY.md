# Cache Strategy for 2027

## Overview

Two-tier caching optimized for Next.js 16 and FastAPI performance.

## Architecture

```
┌─────────────────┐
│   Next.js 16    │  → use cache directive (primary)
└────────┬────────┘
         │ API calls
         ↓
┌─────────────────┐
│   FastAPI       │  → Redis (LLM responses only)
└─────────────────┘
```

## Layer 1: Next.js Cache (Frontend)

### What It Does
- Caches Server Component renders
- Uses React's built-in cache system
- Integrated with Next.js 16's `use cache` directive

### Usage

```typescript
// app/dashboard/page.tsx
'use cache'

export default async function DashboardPage() {
  const data = await fetchUserData() // Cached automatically
  return <Dashboard data={data} />
}
```

### With Cache Life Profiles

```typescript
import { cacheLife } from 'next/cache'

export async function getData() {
  'use cache'
  cacheLife('max') // or 'days', 'hours', 'minutes'
  
  const response = await fetch('https://api.example.com/data')
  return response.json()
}
```

### When to Use
- User dashboards
- Content pages
- Profile data
- Any UI-specific fetches

### Benefits
- Zero configuration
- Automatic cache invalidation
- Integrated with HMR in dev
- Edge-optimized

## Layer 2: Redis Cache (Backend)

### What It Does
- Caches expensive LLM responses
- Rate limiting
- Session storage (if needed)
- API response caching

### Usage in FastAPI

```python
from redis import asyncio as aioredis
from app.core.config import settings

redis = aioredis.from_url(
    settings.REDIS_URL,
    encoding="utf-8",
    decode_responses=True
)

async def get_llm_response(prompt: str):
    # Check cache first
    cache_key = f"llm:{hash(prompt)}"
    cached = await redis.get(cache_key)
    
    if cached:
        return cached
    
    # Call LLM (expensive)
    response = await call_openai(prompt)
    
    # Cache for 1 hour
    await redis.setex(cache_key, 3600, response)
    
    return response
```

### When to Use
- LLM completions (expensive!)
- Embeddings generation
- Vector search results
- Rate limiting counters
- Background job queues

### Benefits
- Fast (sub-millisecond reads)
- TTL support
- Pub/sub for real-time features
- Battle-tested at scale

## What NOT to Cache

### Don't Cache in Next.js
- Real-time data (stock prices, live scores)
- User-specific mutations
- Authentication state (use sessions)
- Frequently changing content

### Don't Cache in Redis
- Individual database queries (use pg connection pooling)
- Static assets (use CDN)
- Next.js page data (Next.js handles this)

## Cache Invalidation

### Next.js Invalidation

```typescript
// Invalidate by tag
import { revalidateTag } from 'next/cache'

revalidateTag('user-data', 'max')

// Invalidate by path
import { revalidatePath } from 'next/cache'

revalidatePath('/dashboard')
```

### Redis Invalidation

```python
# Delete specific key
await redis.delete(f"llm:{prompt_hash}")

# Delete by pattern
keys = await redis.keys("llm:*")
if keys:
    await redis.delete(*keys)

# Set TTL
await redis.expire(key, seconds=3600)
```

## Performance Guidelines

### Next.js Cache Times
- Static content: `cacheLife('max')` (1 year)
- User dashboards: `cacheLife('days')` (1 day)
- Live data: `cacheLife('minutes')` (5 min)
- Real-time: Don't cache

### Redis Cache Times
- LLM responses: 1-24 hours (varies by use case)
- Rate limits: 60 seconds to 1 hour
- Sessions: 7 days
- Temporary data: 5-60 minutes

## Monitoring

### Key Metrics to Track
- Cache hit rate (target: >80%)
- Cache miss latency
- Memory usage
- Eviction rate

### Tools
- Vercel Analytics (Next.js cache)
- Redis INFO command
- CloudWatch (if using AWS ElastiCache)

## Production Setup

### Next.js
```typescript
// next.config.mjs
export default {
  cacheComponents: true,
  cacheHandlers: {
    // Use default Vercel cache
  }
}
```

### Redis
```python
# apps/api/app/core/config.py
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
REDIS_MAX_CONNECTIONS = 50
REDIS_SOCKET_TIMEOUT = 5
REDIS_SOCKET_CONNECT_TIMEOUT = 5
```

## Cost Optimization

### Reduce LLM Costs
1. Cache aggressively (1+ hours for stable prompts)
2. Use cache fingerprinting (hash prompts)
3. Monitor cache hit rates
4. Set appropriate TTLs

### Reduce Redis Costs
1. Use compression for large values
2. Set TTLs on everything
3. Monitor memory usage
4. Use eviction policies (LRU recommended)

## Local Development

### Next.js
- Cache works automatically in dev mode
- Hot reload clears cache automatically

### Redis
```bash
# Docker Compose already includes Redis
docker-compose up redis

# Or use local Redis
brew install redis
redis-server
```

## When to Add More Caching

You probably don't need more caching if:
- Next.js + Redis cover 95% of use cases
- Adding complexity without clear bottleneck
- CDN already handles static assets

Consider adding if:
- Database queries are slow (add query cache layer)
- Third-party API limits hit (cache responses)
- Complex computations repeated (memoize results)

## Summary

**Keep It Simple:**
1. Next.js `use cache` for frontend data fetching
2. Redis for expensive backend operations (especially LLM)
3. Monitor hit rates and optimize TTLs
4. Don't over-engineer

This strategy scales from MVP to millions of users.

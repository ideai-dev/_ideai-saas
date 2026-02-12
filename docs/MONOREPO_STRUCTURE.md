# Monorepo Structure Guide

Complete guide to the monorepo organization and when to use each directory.

## 📁 Directory Breakdown

### `/apps` - Applications
**Purpose**: Complete, deployable applications with their own entry points

```
apps/
├── web/              # Next.js 16 frontend (Vercel)
└── api/              # FastAPI backend (AWS)
```

**When to use**: When building a complete application that has its own deployment target and serves end users directly.

**Examples**:
- Next.js frontend app
- FastAPI backend API
- Admin dashboard
- Marketing website

---

### `/services` - Internal Microservices
**Purpose**: Custom services you build and maintain, consumed by apps or other services

```
services/
├── llm-service/      # Multi-LLM aggregation layer
├── mcp-service/      # Custom MCP server implementation
├── vector-db/        # Vector database abstraction layer
└── api-node/         # Node.js microservice
```

**When to use**: When you need reusable business logic, data processing, or functionality that multiple apps consume.

**Examples**:
- LLM request router (aggregate multiple providers)
- Custom MCP server (your own tools/protocols)
- Vector database abstraction (unified interface for multiple vector DBs)
- Real-time notification service
- Image processing service

---

### `/providers` - Third-Party Integrations
**Purpose**: Configuration and clients for external services and APIs you consume

```
providers/
├── llm/              # OpenAI, Anthropic, Google clients
├── mcp/              # Claude Desktop, v0 MCP configs
├── cloud/            # AWS, Vercel, Supabase SDKs
├── integrations/     # GitHub, Slack, Stripe clients
└── vector/           # Pinecone, Qdrant clients
```

**When to use**: When integrating with any third-party service, API, or SaaS provider.

**Examples**:
- OpenAI API client configuration
- AWS SDK setup
- GitHub API integration
- Stripe payment processing
- Slack notifications
- Pinecone vector search

---

### `/packages` - Shared Code
**Purpose**: Reusable utilities, types, and configurations used across apps and services

```
packages/
├── types/            # Shared TypeScript types
├── config/           # Shared configuration
├── typescript-config/ # Shared TS configs
└── eslint-config/    # Shared linting rules
```

**When to use**: When you have code that multiple apps/services need to share.

**Examples**:
- TypeScript type definitions
- Utility functions
- UI component libraries
- Shared constants
- Configuration presets

---

## 🤔 Decision Tree

### "Should I create a new app?"
✅ Yes if:
- It has its own deployment target
- It serves end users directly
- It has a distinct URL/domain

❌ No if:
- It's just a shared function
- It's consumed by other services
- It's a third-party integration

### "Should I create a new service?"
✅ Yes if:
- You're writing custom business logic
- Multiple apps will consume it
- It needs to scale independently
- It processes data or coordinates workflows

❌ No if:
- It's just calling a third-party API (use `/providers`)
- It's a utility function (use `/packages`)

### "Should I add to providers?"
✅ Yes if:
- It's a third-party API or SaaS
- You're configuring an external service
- It's a cloud provider SDK

❌ No if:
- You're writing the logic yourself (use `/services`)
- It's shared code you maintain (use `/packages`)

## 📊 Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         /apps/web                            │
│                    (Next.js Frontend)                        │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                        /apps/api                             │
│                   (FastAPI Backend)                          │
│                                                              │
│  • Database access (PostgreSQL + pgvector)                  │
│  • Authentication                                            │
│  • Business logic orchestration                             │
└──────┬──────────────────────┬───────────────────────────┬───┘
       │                      │                           │
       ↓                      ↓                           ↓
┌──────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  /services/  │   │   /providers/    │   │   /packages/     │
│              │   │                  │   │                  │
│ • LLM        │   │ • OpenAI         │   │ • types          │
│ • MCP        │   │ • Anthropic      │   │ • config         │
│ • Vector DB  │   │ • AWS            │   │ • utils          │
│              │   │ • GitHub         │   │                  │
└──────────────┘   └──────────────────┘   └──────────────────┘
   (You write)        (Third-party)          (Shared code)
```

## 🎯 Real-World Examples

### Example 1: LLM Integration

**Scenario**: Need to call OpenAI and Anthropic APIs

**Setup**:
```
providers/llm/
├── openai.ts         ← OpenAI client config
└── anthropic.ts      ← Anthropic client config

services/llm-service/
└── src/
    └── index.ts      ← Your router that picks best LLM

apps/api/
└── app/api/v1/endpoints/
    └── chat.py       ← FastAPI endpoint using your service
```

### Example 2: Vector Search

**Scenario**: Need RAG with multiple vector DBs

**Setup**:
```
providers/vector/
├── pinecone.ts       ← Pinecone client
└── qdrant.ts         ← Qdrant client

services/vector-db/
└── src/
    └── index.ts      ← Unified interface for both

apps/api/
└── app/api/v1/endpoints/
    └── search.py     ← FastAPI RAG endpoint
```

### Example 3: GitHub Integration

**Scenario**: Need to create issues and PRs

**Setup**:
```
providers/integrations/
└── github.ts         ← GitHub API client setup

apps/api/
└── app/api/v1/endpoints/
    └── github.py     ← FastAPI endpoints for GitHub operations
```

## 🔐 Database Access

**All database access happens through FastAPI (`/apps/api/`)**

```
apps/api/
├── app/
│   ├── db/
│   │   ├── session.py      # Database session management
│   │   ├── models.py       # SQLAlchemy models
│   │   └── base.py         # Base model class
│   └── api/v1/endpoints/
│       └── users.py        # Endpoints with DB queries
└── alembic/                # Database migrations
```

**Why?**
- Single source of truth for data access
- Centralized connection pooling
- Consistent transaction management
- Easy to add Row Level Security
- Migrations in one place

## 📝 Summary

| Directory | Purpose | You maintain? | Examples |
|-----------|---------|---------------|----------|
| `/apps` | Deployable applications | ✅ Yes | Next.js, FastAPI |
| `/services` | Custom microservices | ✅ Yes | LLM router, MCP server |
| `/providers` | Third-party configs | ⚙️ Config only | OpenAI, AWS, GitHub |
| `/packages` | Shared utilities | ✅ Yes | Types, utils, configs |

**Golden Rule**: If you're writing it = `/services`. If you're consuming it = `/providers`.

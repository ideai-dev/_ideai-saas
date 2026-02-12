# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                     Next.js 16 + React 19                   │
│                     (Vercel Deployment)                     │
└────────────┬────────────────────────────┬───────────────────┘
             │                            │
             ▼                            ▼
    ┌────────────────┐          ┌────────────────┐
    │   Python API   │          │   Node.js API  │
    │   (FastAPI)    │          │   (Express)    │
    │   Port 8000    │          │   Port 3002    │
    └───────┬────────┘          └────────┬───────┘
            │                            │
            └────────────┬───────────────┘
                         │
         ┌───────────────┼──────────────┬─────────────┐
         ▼               ▼              ▼             ▼
    ┌────────┐    ┌──────────┐   ┌─────────┐   ┌──────────┐
    │ LLM    │    │ Vector   │   │Database │   │  Redis   │
    │Service │    │ DB       │   │ (PG)    │   │  Cache   │
    │:3003   │    │Service   │   │ :5432   │   │  :6379   │
    └────────┘    │:3004     │   └─────────┘   └──────────┘
                  └──────────┘
                       │
         ┌─────────────┼──────────────┐
         ▼             ▼              ▼
    ┌────────┐   ┌─────────┐    ┌────────┐
    │Chroma  │   │Pinecone │    │Qdrant  │
    │  DB    │   │         │    │        │
    └────────┘   └─────────┘    └────────┘
```

## Service Breakdown

### Frontend Layer

**Next.js 16 Application**
- **Location**: `/app`
- **Port**: 3000
- **Tech**: React 19, Turbopack, Server Components
- **Deployment**: Vercel
- **Responsibilities**:
  - User interface rendering
  - Client-side state management
  - API request orchestration
  - Authentication UI
  - Real-time updates

### Backend Services

#### 1. FastAPI Service (Python)
- **Location**: `/services/api-python`
- **Port**: 8000
- **Tech**: FastAPI, Pydantic v2, asyncio
- **Use Cases**:
  - ML/AI computations
  - Data processing pipelines
  - Scientific computing
  - Python library integrations (NumPy, pandas, scikit-learn)
  - Complex algorithms

#### 2. Node.js Service
- **Location**: `/services/api-node`
- **Port**: 3002
- **Tech**: Express, TypeScript, ES Modules
- **Use Cases**:
  - Real-time operations
  - WebSocket connections
  - Quick CRUD operations
  - JavaScript library integrations
  - Stream processing

#### 3. LLM Service
- **Location**: `/services/llm-service`
- **Port**: 3003
- **Tech**: AI SDK 6, LangChain
- **Providers**: OpenAI, Anthropic, Google, Groq
- **Use Cases**:
  - Text generation
  - Chat completions
  - Embeddings generation
  - Multi-provider routing
  - Token usage tracking

#### 4. Vector Database Service
- **Location**: `/services/vector-db`
- **Port**: 3004
- **Tech**: Multiple vector DB clients
- **Providers**: ChromaDB, Pinecone, Qdrant, pgvector
- **Use Cases**:
  - Semantic search
  - Document similarity
  - RAG systems
  - Recommendation engines

#### 5. MCP Service
- **Location**: `/services/mcp-service`
- **Tech**: Model Context Protocol SDK
- **Use Cases**:
  - Tool calling for LLMs
  - Context management
  - Function execution
  - API orchestration

### Data Layer

#### PostgreSQL Database
- **Port**: 5432
- **Extensions**: pgvector, pg_trgm, uuid-ossp
- **Features**:
  - JSONB for flexible data
  - Full-text search
  - Vector similarity search
  - Row-level security
  - Connection pooling

#### Redis Cache
- **Port**: 6379
- **Use Cases**:
  - Session storage
  - API response caching
  - Rate limiting
  - Real-time data
  - Pub/Sub messaging

## Communication Patterns

### 1. Frontend → Backend
```typescript
// Frontend calls backend APIs
const response = await fetch('/api/python/generate', {
  method: 'POST',
  body: JSON.stringify({ prompt: 'Hello' })
})
```

### 2. Service-to-Service
```typescript
// Node.js calling Python service
const result = await fetch('http://api-python:8000/process', {
  method: 'POST',
  body: JSON.stringify({ data })
})
```

### 3. Backend → LLM Service
```python
# Python service calling LLM service
async with httpx.AsyncClient() as client:
    response = await client.post(
        'http://llm-service:3003/api/generate',
        json={'provider': 'openai', 'prompt': prompt}
    )
```

### 4. Backend → Vector DB
```typescript
// Any service calling vector DB
const results = await fetch('http://vector-db:3004/api/search', {
  method: 'POST',
  body: JSON.stringify({
    provider: 'pinecone',
    collection: 'docs',
    query: 'machine learning'
  })
})
```

## Data Flow Example: RAG Query

```
1. User asks question in Frontend
         ↓
2. Frontend → Node.js API (/api/chat)
         ↓
3. Node.js → LLM Service (generate embedding)
         ↓
4. LLM Service → OpenAI (embeddings API)
         ↓
5. Node.js → Vector DB Service (search)
         ↓
6. Vector DB → Pinecone (similarity search)
         ↓
7. Node.js → LLM Service (generate answer with context)
         ↓
8. LLM Service → OpenAI (chat completion)
         ↓
9. Response streamed back to Frontend
```

## Deployment Architecture

### Local Development
```yaml
# docker-compose.yml
services:
  web:         # Next.js (port 3000)
  api-python:  # FastAPI (port 8000)
  api-node:    # Express (port 3002)
  llm-service: # LLM router (port 3003)
  vector-db:   # Vector DB service (port 3004)
  postgres:    # Database (port 5432)
  redis:       # Cache (port 6379)
```

### Production (AWS + Vercel)

**Frontend**
- Deployed to Vercel
- Automatic deploys from git
- Edge functions for API routes
- Global CDN

**Backend Services**
```
Option 1: AWS Lambda + API Gateway
├── Python Lambda functions
├── Node.js Lambda functions
└── API Gateway for routing

Option 2: AWS ECS/Fargate
├── Docker containers
├── Auto-scaling
├── Load balancer
└── Service discovery
```

**Databases**
- PostgreSQL: AWS RDS with Multi-AZ
- Redis: AWS ElastiCache
- Vector DB: Pinecone managed or AWS OpenSearch

## Security Architecture

### Authentication Flow
```
1. User logs in → Frontend
2. Frontend → Backend (/auth/login)
3. Backend verifies credentials with DB
4. Backend creates session/JWT
5. Backend returns token to Frontend
6. Frontend stores in httpOnly cookie
7. All subsequent requests include token
8. Backend middleware validates token
```

### API Security
- CORS configuration
- Rate limiting (Redis-backed)
- JWT/session validation
- Input validation (Zod/Pydantic)
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitized inputs)

### Database Security
- Row-level security (RLS)
- Encrypted connections (SSL/TLS)
- Password hashing (bcrypt)
- Prepared statements only
- Audit logging

## Scalability Considerations

### Horizontal Scaling
- Stateless services (except sessions in Redis)
- Load balancer for multiple instances
- Database connection pooling
- Shared cache layer (Redis)

### Caching Strategy
```
L1: Browser cache (static assets)
L2: CDN cache (Vercel Edge)
L3: Redis cache (API responses)
L4: PostgreSQL query cache
```

### Performance Optimizations
- Server components for reduced JS bundle
- API response caching
- Database query optimization
- Connection pooling
- Batch processing where possible
- Streaming for large responses

## Monitoring and Observability

### Logs
- Structured logging (JSON format)
- Centralized log aggregation (CloudWatch/Datadog)
- Request tracing with correlation IDs

### Metrics
- Response times
- Error rates
- Database query performance
- LLM token usage
- Cache hit rates

### Alerts
- High error rates
- Slow response times
- Database connection pool exhaustion
- High LLM costs
- Service downtime

## Technology Choices Rationale

### Why Next.js 16?
- Latest React 19 features
- Turbopack for fast builds
- Server Components for performance
- Built-in API routes
- Excellent Vercel integration

### Why FastAPI?
- Modern Python async framework
- Automatic OpenAPI docs
- Pydantic v2 validation
- Great for ML/AI workloads
- High performance

### Why Express (Node.js)?
- Mature ecosystem
- Fast for real-time operations
- TypeScript support
- Large community
- Easy integration with JS libraries

### Why PostgreSQL?
- ACID compliance
- pgvector for embeddings
- JSONB for flexibility
- Mature and stable
- Excellent performance

### Why Multiple Vector DBs?
- Different use cases
- Avoid vendor lock-in
- Cost optimization
- Performance comparison
- Client-specific requirements

## Future Enhancements

### Planned Features
1. GraphQL API layer
2. WebSocket support for real-time
3. Message queue (RabbitMQ/SQS)
4. Kubernetes deployment
5. Multi-region deployment
6. Advanced caching (Redis Cluster)
7. ML model serving (TensorFlow Serving)
8. Data warehouse integration
9. Event sourcing patterns
10. Microservices mesh (Istio)

### Migration Path
- Current: Monorepo with multiple services
- Phase 1: Extract services into separate repos
- Phase 2: Kubernetes orchestration
- Phase 3: Service mesh implementation
- Phase 4: Event-driven architecture

## Developer Guidelines

See `/docs/TEAM_GUIDE.md` for detailed team-specific guidelines.

Quick links:
- [API Documentation](./API.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [LLM Integration](./LLM_INTEGRATION.md)
- [Team Guide](./TEAM_GUIDE.md)

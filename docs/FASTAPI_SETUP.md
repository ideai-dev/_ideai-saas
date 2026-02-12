# FastAPI Setup & Architecture

## Directory Structure Decision

After careful consideration, here's the optimal structure for a 2027 monorepo:

```
monorepo/
├── apps/
│   ├── web/                    # Next.js frontend application
│   └── api/                    # FastAPI main application
│       ├── app/
│       │   ├── main.py        # Application entry point
│       │   ├── core/          # Core configuration
│       │   ├── api/v1/        # API routes
│       │   ├── middleware/    # Custom middleware
│       │   ├── models/        # Database models
│       │   ├── schemas/       # Pydantic schemas
│       │   └── services/      # Business logic
│       └── requirements.txt
│
├── services/                   # Reusable microservices
│   ├── llm-service/           # LLM router (Node.js/TS)
│   ├── mcp-service/           # Model Context Protocol
│   ├── vector-db/             # Vector database client
│   ├── database/              # Database connection pool
│   ├── api-node/              # Node.js service example
│   └── api-python/            # Python service example
│
└── packages/                   # Shared libraries
    ├── types/                 # Shared TypeScript types
    ├── config/                # Shared configuration
    └── utils/                 # Shared utilities
```

## Why This Structure?

### 1. **apps/api** (FastAPI Main Application)

**Purpose**: Primary API gateway that orchestrates all services

**Responsibilities**:
- HTTP request handling
- Authentication & authorization
- Request validation
- Response formatting
- API versioning
- Documentation (OpenAPI)

**Why Separate**:
- Clear entry point for all API requests
- Centralized middleware and error handling
- Unified API documentation
- Version control for API contracts

### 2. **services/** (Reusable Services)

**Purpose**: Independent, reusable business logic services

**Responsibilities**:
- Specialized functionality (LLM, vector DB, etc.)
- Can be consumed by FastAPI app OR other services
- Can be deployed independently if needed
- Language-agnostic (Python, Node.js, etc.)

**Why Separate**:
- Reusability across different apps
- Independent scaling
- Technology flexibility
- Clear separation of concerns

### 3. **packages/** (Shared Libraries)

**Purpose**: Code shared across all apps and services

**Responsibilities**:
- Type definitions
- Configuration management
- Utility functions
- Constants and enums

**Why Separate**:
- DRY principle
- Consistent types across frontend and backend
- Centralized configuration

## FastAPI Best Practices

### Configuration Management

```python
# apps/api/app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """All config via environment variables"""
    PROJECT_NAME: str = "API"
    DATABASE_URL: str
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Project Structure

```
apps/api/app/
├── main.py                 # FastAPI app instance
├── core/
│   ├── config.py          # Settings
│   ├── security.py        # Auth helpers
│   └── logging_config.py  # Logging setup
├── api/
│   └── v1/
│       ├── __init__.py    # Router aggregation
│       └── endpoints/     # Individual route files
├── models/                # SQLAlchemy models
├── schemas/               # Pydantic schemas
├── services/              # Business logic
├── middleware/            # Custom middleware
└── utils/                 # Utilities
```

### Consuming Services from FastAPI

```python
# apps/api/app/api/v1/endpoints/llm.py
from fastapi import APIRouter, HTTPException

# Import from services directory
# These services are separate and can be used by any app
import sys
sys.path.append('../../../services')

from llm_service import LLMClient
from vector_db import VectorDBClient

router = APIRouter()

@router.post("/chat")
async def chat(request: ChatRequest):
    # Use the shared service
    llm_client = LLMClient()
    response = await llm_client.chat(
        messages=request.messages,
        provider=request.provider
    )
    return response
```

## Development Workflow

### For FastAPI Developers

1. **Start Here**: `apps/api/app/main.py`
2. **Add Endpoints**: `apps/api/app/api/v1/endpoints/`
3. **Add Models**: `apps/api/app/models/`
4. **Add Business Logic**: `apps/api/app/services/`
5. **Use Shared Services**: Import from `services/`

### For Service Developers

1. **Create Service**: `services/my-service/`
2. **Make it Reusable**: Clear interface, no app-specific logic
3. **Document**: README with usage examples
4. **Test**: Independent test suite

### For Frontend Developers

1. **API Client**: Generated from OpenAPI spec
2. **Shared Types**: Import from `packages/types`
3. **Configuration**: Use `packages/config`

## Integration Example

```python
# apps/api/app/api/v1/endpoints/rag.py
"""
RAG endpoint using multiple services
"""
from fastapi import APIRouter
from services.llm_service import LLMClient
from services.vector_db import VectorDBClient
from app.models import Document

router = APIRouter()

@router.post("/rag/query")
async def rag_query(query: str):
    # 1. Generate embedding for query
    llm = LLMClient()
    query_embedding = await llm.embed([query])
    
    # 2. Search vector database
    vector_db = VectorDBClient()
    results = await vector_db.search(
        query_embedding[0],
        limit=5
    )
    
    # 3. Generate response with context
    context = "\\n".join([r.text for r in results])
    response = await llm.chat([
        {"role": "system", "content": f"Context: {context}"},
        {"role": "user", "content": query}
    ])
    
    return {
        "answer": response,
        "sources": results
    }
```

## Summary

**Apps** = Complete applications (FastAPI, Next.js)
**Services** = Reusable business logic (can be used by any app)
**Packages** = Shared code (types, config, utils)

This structure gives you:
- Clear separation of concerns
- Maximum reusability
- Independent scaling
- Team autonomy
- Technology flexibility

Your FastAPI team works in `apps/api/` and consumes services from `services/`. Service teams build reusable modules that any app can use. Frontend team works in `apps/web/` and uses shared types from `packages/`.

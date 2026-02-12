# Services Directory

Internal microservices organized by programming language.

## Structure

```
services/
  python/            All Python 3.12+ services
    llm-service/     LLM routing (uses providers/openai, providers/anthropic)
    mcp-service/     MCP protocol server
  nodejs/            All Node.js 20+ services
    vector-db/       Vector DB abstraction (uses providers/pinecone)
  rust/              All Rust services (future)
    compute/         High-performance vector ops
```

## Rules

1. Each language has its own subfolder
2. Each service is self-contained with its own Dockerfile
3. Services import from /providers for external APIs - never inline SDK setup
4. Services contain YOUR business logic - providers contain thin SDK wrappers
5. Services never access the database directly - that goes through FastAPI (apps/api)
6. Any service can be used by LLM, MCP, or Vector operations - they are composable

## Adding a New Service

1. Pick the right language folder (python/, nodejs/, rust/)
2. Create a new subfolder with README, Dockerfile, and entry point
3. Import providers as needed
4. Register the service endpoint in apps/api

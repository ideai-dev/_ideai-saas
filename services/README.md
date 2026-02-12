# Services Directory

Internal microservices organized by programming language.

## Service registry (single source of truth)

**`services.json`** is the canonical list of all services and apps in one place. Use it to:

- **Index** – tags, categories, and `indexHint` describe what each service does and when to use it
- **Discover** – filter by tag (e.g. `webscraping`, `transcribing`, `llm`, `vector`) or category
- **Orchestrate** – see `dependsOn`, `consumes` (for apps), `providers`, and `path` for wiring and docs

The registry has two top-level lists:

- **`services`** – microservices (live in `/services/` by language: python, nodejs, rust)
- **`apps`** – applications that consume services (e.g. `apps/api` FastAPI gateway)

```bash
# View full registry
cat services/services.json

# List only active services
jq '.services[] | select(.status=="active") | {id, name, tags}' services/services.json

# List apps and what they consume
jq '.apps[] | {id, name, consumes}' services/services.json
```

**Categories:** `ai` | `protocol` | `storage` | `compute` | `data-ingestion` | `media`

**Planned services** (in registry, not yet implemented): webscraping, transcribing, crawling, document-extraction, compute (Rust).

---

### Is Rust a service yet? Why is it mentioned?

**Rust is not a running service yet.** The repo has a placeholder under `services/rust/compute/` (README only, no code). It’s in the registry as **planned** so that:

1. **Architecture** – We know we want a dedicated, high-performance path for CPU-heavy work (batch embeddings, tokenization, data pipelines) instead of overloading Python/Node.
2. **Indexing** – Anything that needs “fast batch compute” or “vector ops at scale” can resolve to this future service.
3. **When to build it** – When Python/Node becomes the bottleneck for bulk vector or text processing, the compute service is the place to implement it (in Rust for speed and predictable memory).

So Rust is **mentioned** as the intended runtime for that future compute service; the service itself is **not implemented yet**.

## Structure

```
services/
  services.json      # Registry: all services + tags + descriptions (index this)
  services.schema.json
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

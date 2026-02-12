# Vector DB Service (Node.js)

Vector database abstraction layer.

**Registry:** `services/services.json` → `id: vector-db`  
**Tags:** vector, embedding, search, similarity, pinecone, chroma, rag, retrieval, semantic

## Language: Node.js 20+ (TypeScript)
## Framework: Express
## Location: services/nodejs/vector-db/

## What This Does
- Abstracts Pinecone (external) and ChromaDB (internal/sovereign)
- Imports from `providers/pinecone/`
- Contains YOUR embedding logic, index management, similarity search

## Structure
```
vector-db/
  src/
    index.ts         # Express app
    embeddings.ts    # Embedding generation
    search.ts        # Similarity search logic
  package.json
  Dockerfile
```

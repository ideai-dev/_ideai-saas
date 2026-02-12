# Sovereign Architecture: Self-Sufficient & Offline-Capable

## Overview

This monorepo is designed for **sovereign operation** - the ability to run entirely self-hosted with zero dependency on external cloud providers. You can operate fully offline with local LLMs and services while maintaining the option to use cloud providers when needed.

## Provider Types

### External Providers (Cloud)
Located in: `providers/[company-name]/`

**Characteristics:**
- Requires internet connectivity
- Requires API keys and payment
- Vendor lock-in risk
- High performance and scale
- Managed infrastructure

**Examples:**
```
providers/
├── openai/         # GPT-4, GPT-4o (cloud)
├── anthropic/      # Claude Sonnet/Opus (cloud)
├── pinecone/       # Managed vector DB (cloud)
├── github/         # GitHub API (cloud)
└── stripe/         # Stripe payments (cloud)
```

### Internal Providers (Sovereign)
Located in: `providers/internal/`

**Characteristics:**
- Runs on your infrastructure
- Works completely offline
- Zero vendor lock-in
- Full data sovereignty
- Privacy & compliance friendly

**Examples:**
```
providers/internal/
├── ollama/         # Local LLMs (Llama, Mistral, Qwen)
├── chromadb/       # Local vector database
├── localai/        # OpenAI-compatible local server
├── whisper/        # Local speech-to-text
└── stable-diffusion/ # Local image generation
```

## Multi-Language Service Architecture

Services are organized by programming language for optimal performance and developer experience:

```
services/
├── python/         # Python 3.12+ services
│   ├── llm-service/      # LLM routing and orchestration
│   ├── mcp-service/      # Model Context Protocol server
│   └── ml-pipeline/      # Data science workloads
│
├── nodejs/         # Node.js 20+ services
│   ├── realtime-ws/      # WebSocket real-time features
│   ├── stream-api/       # Server-Sent Events
│   └── webhook-handler/  # External webhook processing
│
└── rust/          # Rust services (future)
    ├── vector-compute/   # High-performance vector ops
    └── edge-runtime/     # Edge computing workloads
```

### Why Multi-Language?

1. **Python** - AI/ML ecosystem, data science, scientific computing
2. **Node.js** - Real-time features, streaming, JavaScript ecosystem
3. **Rust** - Performance-critical paths, systems programming, WASM

Each service is **completely isolated** with its own:
- Dependencies (requirements.txt, package.json, Cargo.toml)
- Runtime environment
- Container configuration
- Testing setup

## Offline Operation Strategy

### 1. Local LLM Setup (Ollama)

```typescript
// providers/internal/ollama/client.ts
import Ollama from 'ollama'

export const ollama = new Ollama({ host: 'http://localhost:11434' })

export async function callLocalLLM(prompt: string, model = 'llama3.2') {
  const response = await ollama.chat({
    model,
    messages: [{ role: 'user', content: prompt }],
  })
  return response.message.content
}

// Available models: llama3.2, mistral, qwen2.5, codellama, etc.
```

### 2. Local Vector Database (ChromaDB)

```typescript
// providers/internal/chromadb/client.ts
import { ChromaClient } from 'chromadb'

export const chromaClient = new ChromaClient({ path: 'http://localhost:8000' })

export async function createCollection(name: string) {
  return await chromaClient.createCollection({ name })
}

export async function searchLocal(query: string, collection: string) {
  const coll = await chromaClient.getCollection({ name: collection })
  return await coll.query({ queryTexts: [query], nResults: 5 })
}
```

### 3. Service Router Pattern (Fallback Strategy)

```typescript
// services/python/llm-service/router.py
from providers.internal.ollama import call_local_llm
from providers.openai import call_openai

async def route_llm_call(prompt: str, prefer_local: bool = False):
    """
    Smart routing: Try local first if preferred, fallback to cloud
    """
    if prefer_local or not is_internet_available():
        try:
            return await call_local_llm(prompt, model="llama3.2")
        except Exception as e:
            if not is_internet_available():
                raise Exception("No internet and local LLM failed")
            # Fallback to cloud
    
    # Use cloud provider
    return await call_openai(prompt)
```

## Vendored Dependencies Strategy

### Critical Dependencies to Vendor

For production sovereignty, vendor these critical libraries:

```
lib/vendored/
├── react-flow/         # Vendored @xyflow/react
├── shadcn-ui/          # Vendored shadcn components
├── lucide-icons/       # Vendored icon set
└── tailwind-config/    # Locked Tailwind version
```

### Why Vendor?

1. **Dependency Stability** - npm/CDN outages don't affect you
2. **Version Control** - Prevent breaking changes from auto-updates
3. **Offline Development** - Work without internet
4. **Security** - Audit and control exact code running
5. **Compliance** - Meet regulatory requirements

### How to Vendor React Flow

```bash
# 1. Install the package
pnpm add @xyflow/react

# 2. Copy to vendored location
mkdir -p lib/vendored/react-flow
cp -r node_modules/@xyflow/react/* lib/vendored/react-flow/

# 3. Update imports
# Instead of: import { ReactFlow } from '@xyflow/react'
# Use: import { ReactFlow } from '@/lib/vendored/react-flow'

# 4. Lock the version in package.json
{
  "dependencies": {
    "@xyflow/react": "12.3.7"  // Exact version, no ^ or ~
  }
}
```

### Package Manager Configuration

```yaml
# .npmrc or .yarnrc.yml
# Lock exact versions
save-exact=true

# Use local registry mirror for compliance
registry=https://your-internal-npm-mirror.com

# Prefer offline mode
prefer-offline=true
```

## Deployment Models

### 1. Fully Cloud (Default)
- Next.js → Vercel
- FastAPI → AWS Lambda/ECS
- Providers → All external APIs
- **Best for**: Scale, simplicity, managed infrastructure

### 2. Hybrid (Recommended)
- Next.js → Vercel (edge)
- FastAPI → AWS/Your VPC
- Providers → Mix of cloud + internal
- **Best for**: Balance of scale and sovereignty

### 3. Fully Self-Hosted (Sovereign)
- Next.js → Your Kubernetes cluster
- FastAPI → Your VMs/containers
- Providers → All internal (Ollama, ChromaDB, etc.)
- **Best for**: Privacy, compliance, offline operation

## Environment Configuration

### .env.example Updates

```bash
# External Providers (Cloud)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
PINECONE_API_KEY=...

# Internal Providers (Sovereign)
OLLAMA_HOST=http://localhost:11434
CHROMADB_HOST=http://localhost:8000
LOCALAI_HOST=http://localhost:8080

# Provider Selection Strategy
PREFER_LOCAL_LLMS=true           # Try local first
FALLBACK_TO_CLOUD=true           # Fallback to cloud if local fails
OFFLINE_MODE=false               # Block all external calls
```

## Testing Offline Mode

```bash
# 1. Start internal providers
docker compose up ollama chromadb localai

# 2. Set offline mode
export OFFLINE_MODE=true

# 3. Run tests
pnpm test:offline

# 4. Verify no external calls
# All tests should pass using only internal providers
```

## Migration Path: Cloud → Sovereign

### Phase 1: Add Internal Providers
1. Install Ollama locally
2. Set up ChromaDB
3. Configure fallback routing

### Phase 2: Test Hybrid Mode
1. Route 10% traffic to local LLMs
2. Monitor performance and quality
3. Adjust routing thresholds

### Phase 3: Go Fully Sovereign (Optional)
1. Deploy all services on-premises
2. Remove external API keys
3. Enable OFFLINE_MODE=true

## Sovereignty Checklist

- [ ] All critical dependencies vendored in `lib/vendored/`
- [ ] Local LLM running (Ollama with llama3.2)
- [ ] Local vector DB running (ChromaDB)
- [ ] Fallback routing implemented in services
- [ ] Offline mode tested and working
- [ ] Documentation updated with local setup
- [ ] Environment variables configured for internal providers
- [ ] Multi-language services isolated by folder
- [ ] Zero npm registry dependencies for critical paths

## Benefits

✅ **Data Sovereignty** - Your data never leaves your infrastructure
✅ **Offline Operation** - Work without internet connectivity  
✅ **Zero Vendor Lock-in** - Switch providers anytime
✅ **Cost Control** - No surprise API bills
✅ **Compliance Ready** - GDPR, HIPAA, SOC2 friendly
✅ **Performance** - Local inference = lower latency
✅ **Privacy** - Sensitive data stays in-house

---

**Remember**: Sovereignty is a spectrum, not binary. Start hybrid, go fully sovereign when ready.

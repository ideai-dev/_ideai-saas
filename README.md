# 2027 Full-Stack Turborepo Monorepo

Best-in-class monorepo setup for modern applications with Next.js 16, FastAPI, and microservices architecture.

## 🏗️ Architecture

This is a Turborepo monorepo optimized for:
- **Frontend**: Next.js 16 with App Router, React 19, Turbopack
- **Backend**: FastAPI (Python 3.12+) with modern async patterns
- **Microservices**: Node.js services for JS-native integrations
- **Deployment**: Vercel (Frontend) + AWS (Backend services)
- **Development**: v0, Cursor, Claude AI, Docker Desktop compatible

## 📁 Structure

```
├── apps/
│   ├── web/                 # Next.js 16 frontend (Vercel)
│   └── api/                 # FastAPI backend with DB access (AWS)
├── services/
│   ├── llm-service/         # Multi-LLM aggregation layer
│   ├── mcp-service/         # Custom MCP server
│   ├── vector-db/           # Vector database abstraction
│   └── api-node/            # Node.js microservice
├── providers/
│   ├── openai/              # OpenAI SDK wrapper
│   ├── anthropic/           # Anthropic/Claude SDK
│   ├── google/              # Google Cloud/Vertex AI
│   ├── aws/                 # AWS SDK setup
│   ├── github/              # GitHub API client
│   ├── slack/               # Slack SDK
│   ├── stripe/              # Stripe SDK
│   ├── pinecone/            # Pinecone vector DB
│   └── mcp/                 # MCP configs (Claude, v0, shadcn)
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── config/              # Shared configuration
│   ├── typescript-config/   # Shared TS configs
│   └── eslint-config/       # Shared linting
└── docker/                  # Docker configurations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- pnpm 9+
- Docker Desktop

### Installation

```bash
# Install dependencies
pnpm install

# Setup Python environment
cd services/api-python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Development

```bash
# Run all services
pnpm dev

# Run specific workspace
pnpm --filter web dev
pnpm --filter api-python dev
pnpm --filter api-node dev

# Build all
pnpm build

# Lint all
pnpm lint
```

### Docker

```bash
# Build all services
docker compose build

# Run all services
docker compose up

# Run specific service
docker compose up web
docker compose up api-python
```

## 🔧 Technologies

### Frontend (Next.js)
- **Framework**: Next.js 16 with App Router
- **UI**: shadcn/ui, Tailwind CSS 4, Radix UI
- **Themes**: 12 hot-reloadable shadcn themes (Light, Dark, Zinc, Slate, Stone, Rose, Blue, etc.)
- **State**: React 19 with Server Components
- **Visualization**: React Flow, Recharts
- **Forms**: React Hook Form + Zod
- **Deployment**: Vercel

### Backend (FastAPI)
- **Framework**: FastAPI with Pydantic v2
- **Async**: asyncio, httpx
- **Database**: SQLAlchemy 2.0, Alembic
- **Validation**: Pydantic v2
- **Testing**: pytest, pytest-asyncio
- **Deployment**: AWS Lambda, ECS, or App Runner

### Node.js Services
- **Runtime**: Node.js 20+ with ES modules
- **Framework**: Express or Fastify
- **Testing**: Vitest
- **Deployment**: AWS Lambda or Vercel Functions

## 🎯 Best Practices

### Monorepo
- Shared TypeScript configs and types across workspaces
- Optimized caching with Turborepo
- Consistent code style with shared ESLint and Prettier configs
- Atomic commits with workspace-specific changes

### Python/Node Integration
- RESTful APIs with OpenAPI/Swagger documentation
- Shared TypeScript types generated from Python Pydantic models
- Consistent error handling across services
- JWT authentication shared between services

### CI/CD
- GitHub Actions for automated testing
- Vercel for frontend deployment
- AWS CDK/Terraform for infrastructure
- Docker containers for consistent environments

### Development
- Hot reloading for all services
- Docker Compose for local development
- Shared environment variables
- Type safety across the stack

## ✨ Key Features

### 🎨 Theme System
- **12 Pre-configured Themes** with instant hot reloading
- **Theme Showcase Page** at `/themes` to preview all components
- **Production-ready** shadcn/ui color variations
- View [Theme Documentation](./docs/THEME_SYSTEM.md)

### 🤖 MCP Integration
- **v0 AI Code Generation** - Generate React components
- **shadcn CLI** - Add/update components via MCP
- **Vercel Platform** - Deploy and manage from Claude/Cursor
- **Custom MCP Server** - Database queries, LLM ops, vector search
- View [MCP Setup Guide](./docs/MCP_SETUP.md)

### 🏗️ Architecture
- **FastAPI Gateway** - Single API entry point with database access
- **Microservices** - LLM router, MCP server, vector DB abstraction
- **Third-party Providers** - Centralized configs for OpenAI, GitHub, Slack, etc.
- View [Architecture Guide](./docs/MONOREPO_STRUCTURE.md)

## 📚 Documentation

### Essential Reading
- [**START HERE**](./START_HERE.md) - Complete overview for new team members
- [Architecture Decisions](./docs/ARCHITECTURE_DECISIONS.md) - WHY we made key choices
- [How to Add Services](./docs/HOW_TO_ADD_SERVICES.md) - Add Python/Node services

### Architecture & Design
- [Monorepo Structure](./docs/MONOREPO_STRUCTURE.md) - Where to put code
- [Architecture Guide](./docs/ARCHITECTURE.md) - System design & data flow
- [Cache Strategy](./docs/CACHE_STRATEGY.md) - Next.js + Redis approach

### Features & Integration
- [Theme System](./docs/THEME_SYSTEM.md) - Hot-reloadable themes
- [MCP Setup](./docs/MCP_SETUP.md) - Claude Desktop, Cursor, v0 integration
- [LLM Integration](./docs/LLM_INTEGRATION.md) - Multi-LLM setup

### Team Resources
- [Team Guide](./docs/TEAM_GUIDE.md) - Onboarding for all teams
- [FastAPI Setup](./docs/FASTAPI_SETUP.md) - Backend patterns
- [API Documentation](./docs/API.md) - API reference
- [Deployment](./docs/DEPLOYMENT.md) - Production deployment

## 🤝 Contributing

This monorepo is designed for v0, Cursor, and Claude AI assistance. Each package has detailed documentation and follows modern best practices.

## 📄 License

MIT

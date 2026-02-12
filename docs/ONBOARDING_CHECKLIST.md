# Developer Onboarding Checklist

Welcome to the team! This checklist will get you up to speed in 3 days.

## Day 1: Understanding & Setup

### Morning: Understanding the Architecture

- [ ] Read [START_HERE.md](../START_HERE.md) completely (30 min)
- [ ] Read [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) - understand WHY (20 min)
- [ ] Review the interactive React Flow diagram at http://localhost:3000 (10 min)

**Key Concepts to Understand:**
- Three-tier architecture (Apps → Services → Providers)
- FastAPI as single API gateway
- Provider vs Service distinction
- Database access only via FastAPI

### Afternoon: Local Setup

- [ ] Clone the repository
  ```bash
  git clone <repo-url>
  cd monorepo
  ```

- [ ] Install dependencies
  ```bash
  pnpm install
  ```

- [ ] Set up environment variables
  ```bash
  cp .env.example .env.local
  cp providers/.env.example providers/.env
  cp apps/api/.env.example apps/api/.env
  ```

- [ ] Start Docker services
  ```bash
  docker-compose up -d
  ```

- [ ] Verify services are running
  - [ ] Frontend: http://localhost:3000
  - [ ] FastAPI Docs: http://localhost:8000/docs
  - [ ] Check health endpoints

### End of Day 1

**You should understand:**
- The three-tier architecture (Apps, Services, Providers)
- Why we use FastAPI as single gateway
- Why providers are organized by company
- Where database access lives (FastAPI only)
- How caching works (Next.js + Redis)

---

## Day 2: Exploration & First Contribution

### Morning: Explore the Codebase

- [ ] Read your team-specific guide in [TEAM_GUIDE.md](./TEAM_GUIDE.md)
  - Frontend Dev → Frontend Team section
  - Backend Dev → Python/FastAPI Team section
  - Full-stack → Read both sections

- [ ] Explore the structure
  ```bash
  # Look at apps (deployable)
  ls apps/web apps/api
  
  # Look at services (your business logic)
  ls services/llm-service services/mcp-service
  
  # Look at providers (external companies)
  ls providers/openai providers/anthropic providers/github
  
  # Look at shared packages
  ls packages/types packages/config
  ```

- [ ] Review code patterns
  - [ ] Check `apps/api/app/api/v1/endpoints/` for FastAPI patterns
  - [ ] Check `services/llm-service/src/` for service patterns
  - [ ] Check `providers/openai/client.ts` for provider patterns

### Afternoon: Make Your First Change

Pick ONE based on your role:

**Frontend Developers:**
- [ ] Follow [HOW_TO_ADD_SERVICES.md](./HOW_TO_ADD_SERVICES.md) to add a new page
- [ ] Test the theme switcher on your page
- [ ] Call an existing FastAPI endpoint from your page

**Backend Developers:**
- [ ] Follow [FASTAPI_SETUP.md](./FASTAPI_SETUP.md) to add a new endpoint
- [ ] Test it in the FastAPI docs at http://localhost:8000/docs
- [ ] Call it from the Next.js frontend

**Full-Stack Developers:**
- [ ] Add a new endpoint in FastAPI
- [ ] Create a corresponding page in Next.js
- [ ] Connect them end-to-end

### End of Day 2

**You should have:**
- Made your first code contribution
- Tested locally end-to-end
- Understood the development workflow
- Seen how Apps, Services, and Providers work together

---

## Day 3: Deep Dive & Best Practices

### Morning: Advanced Topics

Pick the topics relevant to your role:

**Everyone:**
- [ ] Read [CACHE_STRATEGY.md](./CACHE_STRATEGY.md)
  - Understand Next.js `use cache` directive
  - Understand when FastAPI uses Redis
- [ ] Read [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md)
  - Decision trees for where to put code
  - Examples of correct placements

**Frontend Focus:**
- [ ] Read [THEME_SYSTEM.md](./THEME_SYSTEM.md)
- [ ] Visit `/themes` page to see all components
- [ ] Learn about Next.js 16 Server Components
- [ ] Understand React 19 features

**Backend Focus:**
- [ ] Read [LLM_INTEGRATION.md](./LLM_INTEGRATION.md)
- [ ] Understand how services use providers
- [ ] Review database models in `apps/api/app/db/models.py`
- [ ] Learn Alembic migrations

**AI/ML Focus:**
- [ ] Deep dive into [LLM_INTEGRATION.md](./LLM_INTEGRATION.md)
- [ ] Understand the LLM Service architecture
- [ ] Review provider integrations (OpenAI, Anthropic)
- [ ] Learn about vector database usage

### Afternoon: Practice & Questions

- [ ] Add a new provider (if needed)
  - Create `providers/[company-name]/client.ts`
  - Add credentials to `providers/.env`
  - Import in a service

- [ ] Add a new internal service (if needed)
  - Follow [HOW_TO_ADD_SERVICES.md](./HOW_TO_ADD_SERVICES.md)
  - Create in `services/[service-name]/`
  - Call from FastAPI
  - Use providers if needed

- [ ] Ask questions in team chat
  - What patterns do we follow?
  - Where does specific logic belong?
  - How do we test this?

### End of Day 3

**You should be able to:**
- Decide where new code belongs (Apps/Services/Providers)
- Add new endpoints to FastAPI
- Create new pages in Next.js
- Use providers in services correctly
- Understand the caching strategy
- Navigate the codebase confidently

---

## Week 1: Team Integration

### During Your First Week

- [ ] **Pair with a team member** on a real task
- [ ] **Review someone's PR** to learn code review standards
- [ ] **Attend architecture discussions** to understand decisions
- [ ] **Read [CONTRIBUTING.md](../CONTRIBUTING.md)** for code standards
- [ ] **Set up your IDE** with recommended extensions (see `.vscode/extensions.json`)

### Your First Real Task

When you're ready for your first assigned task:

1. **Understand requirements**
   - Read the ticket/issue completely
   - Ask clarifying questions upfront
   - Sketch out your approach

2. **Decide where code belongs**
   - Apps (new deployable)?
   - Services (new business logic)?
   - Providers (new external service)?
   - Check [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md) decision trees

3. **Follow patterns**
   - Look at similar existing code
   - Copy the pattern, don't invent new ones
   - Use the same file structure

4. **Test locally**
   - Run the affected services
   - Test end-to-end
   - Check error cases

5. **Submit PR**
   - Clear description
   - Link to ticket/issue
   - Add screenshots if UI changes
   - Tag relevant reviewers

---

## Common Patterns Reference

### Adding a Provider (External Company)

```
1. Create: providers/[company]/client.ts
2. Add env: providers/.env
3. Import in service: services/my-service/
4. DON'T put business logic in provider
```

### Adding a Service (Your Logic)

```
1. Create: services/[service-name]/
2. Add package.json with dependencies
3. Import providers as needed
4. Add endpoint in apps/api to call it
5. Call from apps/web
```

### Adding an API Endpoint

```
1. Create: apps/api/app/api/v1/endpoints/[feature].py
2. Register in: apps/api/app/api/v1/__init__.py
3. Test in: http://localhost:8000/docs
4. Call from: apps/web
```

### Adding a Next.js Page

```
1. Create: apps/web/app/[route]/page.tsx
2. Use Server Components by default
3. Call FastAPI via fetch
4. Use shared types from packages/types
```

### Using Cache

```typescript
// Next.js (UI data)
'use cache'
export async function getServerData() {
  // Cached by Next.js
}

// FastAPI (expensive operations)
@cache_with_redis(ttl=3600)
async def expensive_llm_call():
  # Cached by Redis
```

---

## Quick Reference Commands

```bash
# Development
pnpm dev                  # Run all services
docker-compose up         # Start infrastructure
pnpm --filter web dev     # Run only frontend
pnpm --filter api dev     # Run only FastAPI

# Building
pnpm build                # Build all
docker-compose build      # Rebuild containers

# Testing
pnpm test                 # Run all tests
pnpm lint                 # Lint all code

# Database (in apps/api)
alembic upgrade head      # Run migrations
alembic revision -m "..." # Create migration

# Cleaning
docker-compose down -v    # Stop and remove volumes
pnpm clean                # Clean build artifacts
```

---

## Need Help?

### Documentation
1. [START_HERE.md](../START_HERE.md) - Architecture overview
2. [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) - Why we made choices
3. [HOW_TO_ADD_SERVICES.md](./HOW_TO_ADD_SERVICES.md) - Step-by-step guides
4. [TEAM_GUIDE.md](./TEAM_GUIDE.md) - Role-specific guidance

### Questions
- **Architecture questions**: Check [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md)
- **API questions**: Check [FASTAPI_SETUP.md](./FASTAPI_SETUP.md)
- **LLM questions**: Check [LLM_INTEGRATION.md](./LLM_INTEGRATION.md)
- **Still stuck**: Ask in team chat!

---

## Checklist Complete! 🎉

After completing this checklist, you should:
- ✅ Understand the three-tier architecture
- ✅ Know where to put different types of code
- ✅ Have made your first contribution
- ✅ Be able to work independently on tasks
- ✅ Know where to find documentation
- ✅ Feel confident asking questions

**Welcome to the team! Let's build amazing things together! 🚀**

# How to Add New Services - Step by Step Guide

This guide shows you exactly how to add new Python or Node.js services to the monorepo and immediately see them working in the Next.js UI.

## 📋 Quick Decision Tree

**Should I create a new service or add to existing?**

- **NEW SERVICE** if: Independent functionality, different deployment, separate scaling needs
- **ADD TO FASTAPI** if: Needs database access, auth, or CRUD operations
- **ADD TO EXISTING SERVICE** if: Extends current service functionality

---

## 🐍 Adding a New Python Service

### Step 1: Create Service Structure

```bash
# From monorepo root
mkdir -p services/my-python-service/app
cd services/my-python-service
```

### Step 2: Create Files

**`requirements.txt`**
```txt
fastapi==0.115.0
uvicorn[standard]==0.32.0
httpx==0.27.2
pydantic==2.9.0
pydantic-settings==2.5.0
```

**`app/main.py`**
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="My Python Service",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "my-python-service"}

@app.get("/api/v1/process")
async def process_data(data: str):
    # Your processing logic here
    return {"result": f"Processed: {data}"}
```

**`Dockerfile`**
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

**`README.md`**
```md
# My Python Service

## Run Locally
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Run with Docker
```bash
docker build -t my-python-service .
docker run -p 8001:8001 my-python-service
```
```

### Step 3: Add to Docker Compose

Edit `/docker-compose.yml`:

```yaml
services:
  # ... existing services ...
  
  my-python-service:
    build:
      context: ./services/my-python-service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      - ENV=development
    volumes:
      - ./services/my-python-service:/app
    depends_on:
      - postgres
      - redis
```

### Step 4: Add to Turborepo (Optional)

Edit `/turbo.json`:

```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

Create `services/my-python-service/package.json`:

```json
{
  "name": "@monorepo/my-python-service",
  "version": "1.0.0",
  "scripts": {
    "dev": "uvicorn app.main:app --reload --port 8001",
    "start": "uvicorn app.main:app --host 0.0.0.0 --port 8001"
  }
}
```

### Step 5: Connect to FastAPI Gateway

Edit `/apps/api/app/main.py`:

```python
from fastapi import FastAPI
import httpx

app = FastAPI()

# Proxy to your new service
@app.get("/api/my-service/{path:path}")
async def proxy_to_my_service(path: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"http://my-python-service:8001/{path}")
        return response.json()
```

### Step 6: Call from Next.js

Create `/app/api/my-service/route.ts`:

```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const data = searchParams.get('data')
  
  const response = await fetch(
    `${process.env.FASTAPI_URL}/api/my-service/api/v1/process?data=${data}`
  )
  
  return Response.json(await response.json())
}
```

Use in a component:

```tsx
'use client'

export default function MyServiceComponent() {
  const [result, setResult] = useState(null)
  
  const processData = async () => {
    const res = await fetch('/api/my-service?data=test')
    setResult(await res.json())
  }
  
  return (
    <button onClick={processData}>
      Process with Python Service
    </button>
  )
}
```

---

## 🟨 Adding a New Node.js Service

### Step 1: Create Service Structure

```bash
mkdir -p services/my-node-service/src
cd services/my-node-service
```

### Step 2: Create Files

**`package.json`**
```json
{
  "name": "@monorepo/my-node-service",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.21.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^5.0.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.3"
  }
}
```

**`src/index.ts`**
```typescript
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'my-node-service' })
})

app.post('/api/v1/transform', (req, res) => {
  const { data } = req.body
  // Your transformation logic
  res.json({ transformed: data.toUpperCase() })
})

app.listen(PORT, () => {
  console.log(`My Node Service running on port ${PORT}`)
})
```

**`tsconfig.json`**
```json
{
  "extends": "../../packages/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**`Dockerfile`**
```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["node", "dist/index.js"]
```

### Step 3: Add to Docker Compose

```yaml
  my-node-service:
    build:
      context: ./services/my-node-service
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
    volumes:
      - ./services/my-node-service:/app
      - /app/node_modules
```

### Step 4: Connect to Next.js

```typescript
// app/api/transform/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  const response = await fetch(
    `${process.env.NODE_SERVICE_URL}/api/v1/transform`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }
  )
  
  return Response.json(await response.json())
}
```

---

## 🔗 Adding Endpoints to Existing FastAPI

### Step 1: Create New Endpoint File

```bash
# From apps/api/app/api/v1/endpoints/
touch my_feature.py
```

**`my_feature.py`**
```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db

router = APIRouter()

@router.get("/my-feature/list")
async def list_items(db: Session = Depends(get_db)):
    # Query database
    return {"items": []}

@router.post("/my-feature/create")
async def create_item(name: str, db: Session = Depends(get_db)):
    # Create in database
    return {"id": 1, "name": name}
```

### Step 2: Register Router

Edit `/apps/api/app/api/v1/__init__.py`:

```python
from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, users, my_feature

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(my_feature.router, prefix="/features", tags=["features"])
```

### Step 3: Call from Next.js

```typescript
// app/api/features/route.ts
export async function GET() {
  const res = await fetch(`${process.env.FASTAPI_URL}/api/v1/my-feature/list`)
  return Response.json(await res.json())
}
```

---

## 🌐 Using Third-Party Providers

### Adding a New Provider

**1. Add credentials to `/providers/.env.example`:**

```bash
# New Provider
NEW_PROVIDER_API_KEY=your_key_here
NEW_PROVIDER_BASE_URL=https://api.newprovider.com
```

**2. Create provider client `/providers/integrations/new-provider.ts`:**

```typescript
export class NewProviderClient {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.NEW_PROVIDER_API_KEY!
    this.baseUrl = process.env.NEW_PROVIDER_BASE_URL!
  }

  async callApi(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return response.json()
  }
}
```

**3. Use in your service:**

```python
# In FastAPI
import httpx

async def call_new_provider(data: dict):
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.NEW_PROVIDER_BASE_URL}/endpoint",
            headers={"Authorization": f"Bearer {settings.NEW_PROVIDER_API_KEY}"},
            json=data
        )
        return response.json()
```

```typescript
// In Node.js
import { NewProviderClient } from '../../providers/integrations/new-provider'

const provider = new NewProviderClient()
const result = await provider.callApi('/endpoint', data)
```

---

## 🎯 Complete Flow Example

**Scenario:** Add image processing service

1. **Create Python service** at `/services/image-processor/`
2. **Add Dockerfile** and dependencies (Pillow, OpenCV)
3. **Add to docker-compose.yml** on port 8002
4. **Create FastAPI proxy** at `/apps/api/app/api/v1/endpoints/images.py`
5. **Add Next.js API route** at `/app/api/images/process/route.ts`
6. **Use in component:**

```tsx
const processImage = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  
  const res = await fetch('/api/images/process', {
    method: 'POST',
    body: formData
  })
  
  return await res.json()
}
```

---

## 🚀 Testing Your New Service

```bash
# Start all services
docker-compose up

# Test Python service directly
curl http://localhost:8001/health

# Test through FastAPI gateway
curl http://localhost:8000/api/my-service/health

# Test through Next.js
curl http://localhost:3000/api/my-service

# View in browser
open http://localhost:3000
```

---

## 📚 Best Practices

1. **Always add health endpoints** to every service
2. **Use environment variables** for all configuration
3. **Add README.md** to each service directory
4. **Write API documentation** in service README
5. **Add to docker-compose.yml** for local development
6. **Proxy through FastAPI** for unified API gateway
7. **Type your API responses** in shared packages
8. **Add error handling** at every layer
9. **Log with structured data** (JSON logs)
10. **Monitor with health checks** and metrics

---

## 🔍 Troubleshooting

**Service not starting?**
- Check port conflicts: `lsof -i :8001`
- Check Docker logs: `docker-compose logs my-service`

**Can't connect to service?**
- Verify in docker-compose network
- Check environment variables
- Test with curl first

**Next.js can't reach service?**
- Ensure FASTAPI_URL is set in .env.local
- Check CORS configuration
- Verify route is registered

---

## 📖 Further Reading

- [MONOREPO_STRUCTURE.md](./MONOREPO_STRUCTURE.md) - Architecture decisions
- [FASTAPI_SETUP.md](./FASTAPI_SETUP.md) - FastAPI patterns
- [TEAM_GUIDE.md](./TEAM_GUIDE.md) - Team workflows
- [PROVIDERS_GUIDE.md](./PROVIDERS_GUIDE.md) - Third-party integrations

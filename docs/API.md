# API Documentation

Complete API documentation for the 2027 Full-Stack Monorepo.

## Services Overview

| Service | Technology | Port | Documentation |
|---------|-----------|------|---------------|
| Frontend | Next.js 16 | 3000 | N/A |
| Python API | FastAPI | 8000 | http://localhost:8000/docs |
| Node.js API | Express | 3001 | This document |

## Python API (FastAPI)

Base URL: `http://localhost:8000`

### Interactive Documentation

FastAPI provides automatic interactive API documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Endpoints

#### Health Check
```http
GET /health
```

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2027-01-01T00:00:00Z",
  "service": "api-python",
  "version": "1.0.0"
}
```

#### Get Items
```http
GET /api/items?skip=0&limit=100
```

**Query Parameters**
- `skip` (int): Number of items to skip (pagination)
- `limit` (int): Maximum number of items to return

**Response**
```json
[
  {
    "id": "1",
    "name": "Item Name",
    "description": "Item description",
    "price": 99.99,
    "tags": ["tag1", "tag2"],
    "created_at": "2027-01-01T00:00:00Z"
  }
]
```

#### Get Single Item
```http
GET /api/items/{item_id}
```

**Response**
```json
{
  "id": "1",
  "name": "Item Name",
  "description": "Item description",
  "price": 99.99,
  "tags": ["tag1", "tag2"],
  "created_at": "2027-01-01T00:00:00Z"
}
```

#### Create Item
```http
POST /api/items
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "New Item",
  "description": "Item description",
  "price": 99.99,
  "tags": ["tag1", "tag2"]
}
```

**Response** (201 Created)
```json
{
  "id": "2",
  "name": "New Item",
  "description": "Item description",
  "price": 99.99,
  "tags": ["tag1", "tag2"],
  "created_at": "2027-01-01T00:00:00Z"
}
```

#### Update Item
```http
PUT /api/items/{item_id}
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "Updated Item",
  "description": "Updated description",
  "price": 149.99,
  "tags": ["tag1"]
}
```

**Response**
```json
{
  "id": "1",
  "name": "Updated Item",
  "description": "Updated description",
  "price": 149.99,
  "tags": ["tag1"],
  "created_at": "2027-01-01T00:00:00Z"
}
```

#### Delete Item
```http
DELETE /api/items/{item_id}
```

**Response** (204 No Content)

## Node.js API (Express)

Base URL: `http://localhost:3001`

### Endpoints

#### Health Check
```http
GET /health
```

**Response**
```json
{
  "status": "healthy",
  "timestamp": "2027-01-01T00:00:00.000Z",
  "service": "api-node",
  "version": "1.0.0",
  "uptime": 123.456
}
```

#### Get Tasks
```http
GET /api/tasks
```

**Response**
```json
[
  {
    "id": "uuid-1",
    "title": "Task Title",
    "description": "Task description",
    "completed": false,
    "createdAt": "2027-01-01T00:00:00.000Z"
  }
]
```

#### Get Single Task
```http
GET /api/tasks/{task_id}
```

**Response**
```json
{
  "id": "uuid-1",
  "title": "Task Title",
  "description": "Task description",
  "completed": false,
  "createdAt": "2027-01-01T00:00:00.000Z"
}
```

#### Create Task
```http
POST /api/tasks
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "New Task",
  "description": "Task description",
  "completed": false
}
```

**Response** (201 Created)
```json
{
  "id": "uuid-2",
  "title": "New Task",
  "description": "Task description",
  "completed": false,
  "createdAt": "2027-01-01T00:00:00.000Z"
}
```

#### Update Task
```http
PUT /api/tasks/{task_id}
Content-Type: application/json
```

**Request Body**
```json
{
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true
}
```

**Response**
```json
{
  "id": "uuid-1",
  "title": "Updated Task",
  "description": "Updated description",
  "completed": true,
  "createdAt": "2027-01-01T00:00:00.000Z"
}
```

#### Delete Task
```http
DELETE /api/tasks/{task_id}
```

**Response** (204 No Content)

## Authentication

### Current Implementation
Both APIs currently use a mock authentication system for development. In production, implement:

### Recommended: JWT Authentication

1. **Login**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "expires_in": 3600
}
```

2. **Authenticated Requests**
```http
GET /api/items
Authorization: Bearer eyJ...
```

### Implementation Steps

#### Python (FastAPI)
```python
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    # Verify JWT token
    return user
```

#### Node.js (Express)
```typescript
import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Error Handling

All APIs follow consistent error response format:

```json
{
  "error": "Error message",
  "status_code": 400,
  "details": {
    "field": "Additional error context"
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## Rate Limiting

Implement rate limiting for production:

### Python (FastAPI)
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/items")
@limiter.limit("100/minute")
async def get_items():
    ...
```

### Node.js (Express)
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## CORS Configuration

Both APIs are configured to accept requests from:
- `http://localhost:3000` (development)
- `https://*.vercel.app` (production)

Update CORS origins in production via environment variables:
```bash
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Versioning

For API versioning, use URL prefixes:
- `/api/v1/items`
- `/api/v2/items`

This allows you to maintain multiple API versions simultaneously.

## Testing

### Python API
```bash
cd services/api-python
pytest tests/
```

### Node.js API
```bash
cd services/api-node
pnpm test
```

### Example Test (Python)
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_get_items():
    response = client.get("/api/items")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### Example Test (Node.js)
```typescript
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './index';

describe('GET /api/tasks', () => {
  it('should return tasks', async () => {
    const response = await request(app).get('/api/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
```

## Client Usage

### Frontend (Next.js)

```typescript
// Server Component
async function ItemsList() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_PYTHON_URL}/api/items`);
  const items = await res.json();
  
  return <div>{/* render items */}</div>;
}

// Client Component with SWR
'use client'
import useSWR from 'swr';

function ItemsList() {
  const { data, error } = useSWR('/api/items', fetcher);
  
  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  
  return <div>{/* render items */}</div>;
}
```

## WebSocket Support (Optional)

For real-time features, add WebSocket support:

### Python (FastAPI)
```python
from fastapi import WebSocket

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        await websocket.send_text(f"Message: {data}")
```

### Node.js (Socket.io)
```typescript
import { Server } from 'socket.io';

const io = new Server(server);

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});
```

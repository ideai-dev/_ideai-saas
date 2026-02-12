# FastAPI Application

Production-ready FastAPI application with proper project structure, configuration management, and middleware.

## Project Structure

```
apps/api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # Application entry point
│   ├── core/
│   │   ├── config.py          # Pydantic settings
│   │   └── logging_config.py  # Logging setup
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py    # API router
│   │       └── endpoints/     # API endpoints
│   │           ├── auth.py
│   │           ├── users.py
│   │           ├── llm.py
│   │           ├── vectors.py
│   │           └── documents.py
│   ├── middleware/            # Custom middleware
│   │   ├── request_id.py
│   │   └── timing.py
│   ├── models/                # Database models
│   ├── schemas/               # Pydantic schemas
│   ├── services/              # Business logic
│   └── utils/                 # Utility functions
├── requirements.txt
└── README.md
```

## Quick Start

### 1. Install Dependencies

```bash
cd apps/api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your settings
```

### 3. Run Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Access API Documentation

- Swagger UI: http://localhost:8000/api/v1/docs
- ReDoc: http://localhost:8000/api/v1/redoc
- OpenAPI JSON: http://localhost:8000/api/v1/openapi.json

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `OPENAI_API_KEY`: OpenAI API key for LLM features
- `SECRET_KEY`: Secret key for JWT tokens

## API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /api/v1/health` - Detailed health check

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### LLM
- `POST /api/v1/llm/chat` - Chat completion
- `POST /api/v1/llm/embed` - Generate embeddings
- `GET /api/v1/llm/models` - List available models

### Vectors
- `POST /api/v1/vectors/search` - Vector similarity search

### Documents
- `POST /api/v1/documents` - Create document
- `GET /api/v1/documents/{id}` - Get document

## Development

### Code Quality

```bash
# Format code
black app/

# Lint code
ruff check app/

# Type checking
mypy app/
```

### Testing

```bash
pytest
pytest --cov=app tests/
```

## Deployment

### Using Docker

```bash
docker build -t fastapi-app -f ../../docker/Dockerfile.python .
docker run -p 8000:8000 fastapi-app
```

### Using Docker Compose

```bash
cd ../..
docker-compose up api-python
```

## Integration with Services

This FastAPI app is designed to consume the shared services:

```python
# Example: Using LLM Service
from services.llm_service import LLMClient

llm_client = LLMClient()
response = await llm_client.chat(messages=[...])

# Example: Using Vector DB Service
from services.vector_db import VectorDBClient

vector_client = VectorDBClient()
results = await vector_client.search(query_vector=[...])
```

## Best Practices

1. **Configuration**: All configuration via environment variables using Pydantic Settings
2. **Logging**: Structured JSON logging for production
3. **Middleware**: Request ID, timing, CORS configured
4. **Error Handling**: Proper exception handling and HTTP status codes
5. **Documentation**: Automatic OpenAPI documentation
6. **Testing**: Comprehensive test coverage
7. **Type Safety**: Full type hints with mypy validation

## Team Handoff

**For FastAPI Developers:**

1. Start by reviewing `app/main.py` - the application entry point
2. Configuration is in `app/core/config.py` - all environment variables
3. Add new endpoints in `app/api/v1/endpoints/`
4. Business logic goes in `app/services/`
5. Database models in `app/models/`
6. Request/response schemas in `app/schemas/`

**Key Files to Know:**

- `app/main.py` - Main application, middleware, startup/shutdown
- `app/core/config.py` - All configuration with Pydantic Settings
- `app/api/v1/__init__.py` - API router registration
- `app/api/v1/endpoints/llm.py` - Example endpoint implementation

**Next Steps:**

1. Implement authentication in `endpoints/auth.py`
2. Create database models in `app/models/`
3. Integrate with shared services (LLM, Vector DB, Database)
4. Add comprehensive tests
5. Set up Alembic for database migrations

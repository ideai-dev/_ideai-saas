"""
Application Configuration using Pydantic Settings
"""
from typing import Any, List, Optional
from pydantic import field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings with environment variable support"""
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # Project Info
    PROJECT_NAME: str = "FastAPI Monorepo API"
    DESCRIPTION: str = "High-performance API built with FastAPI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://yourdomain.com",
    ]
    
    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/dbname"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_CACHE_TTL: int = 3600
    
    # Vector Database
    VECTOR_DB_TYPE: str = "chroma"  # chroma, pinecone, qdrant
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    PINECONE_API_KEY: Optional[str] = None
    PINECONE_ENVIRONMENT: Optional[str] = None
    QDRANT_URL: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None
    
    # LLM Providers
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    
    # Default LLM Settings
    DEFAULT_LLM_PROVIDER: str = "openai"
    DEFAULT_LLM_MODEL: str = "gpt-4o"
    DEFAULT_EMBEDDING_MODEL: str = "text-embedding-3-small"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_BURST: int = 100
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json or text
    
    # AWS (if deploying to AWS)
    AWS_REGION: Optional[str] = "us-east-1"
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    
    # Monitoring
    SENTRY_DSN: Optional[str] = None
    
    # Worker Settings
    WORKER_CONCURRENCY: int = 4
    WORKER_TIMEOUT: int = 300


settings = Settings()

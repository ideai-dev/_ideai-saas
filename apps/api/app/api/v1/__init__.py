"""
API v1 Router
"""
from fastapi import APIRouter

from app.api.v1.endpoints import (
    auth,
    users,
    llm,
    vectors,
    documents,
    health,
)

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(llm.router, prefix="/llm", tags=["llm"])
api_router.include_router(vectors.router, prefix="/vectors", tags=["vectors"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])

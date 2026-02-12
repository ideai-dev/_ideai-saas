"""
Request Timing Middleware
"""
import time
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class TimingMiddleware(BaseHTTPMiddleware):
    """Add request timing headers"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response: Response = await call_next(request)
        
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        return response

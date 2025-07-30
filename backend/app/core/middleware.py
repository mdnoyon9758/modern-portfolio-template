"""
Security Middleware
Provides rate limiting, security headers, and request logging
"""

import time
import logging
from typing import Callable
from fastapi import Request, Response, HTTPException, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.security import security_manager, SECURITY_HEADERS

# Set up middleware logger
middleware_logger = logging.getLogger("middleware")
middleware_logger.setLevel(logging.INFO)
handler = logging.FileHandler("middleware.log")
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
middleware_logger.addHandler(handler)

class SecurityMiddleware(BaseHTTPMiddleware):
    """
    Comprehensive security middleware that handles:
    - Rate limiting
    - Security headers
    - Request logging
    - Input validation
    """
    
    def __init__(self, app, rate_limit_requests: int = 100, rate_limit_window: int = 60):
        super().__init__(app)
        self.rate_limit_requests = rate_limit_requests
        self.rate_limit_window = rate_limit_window
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process request through security middleware
        """
        start_time = time.time()
        
        # Get client IP for logging
        client_ip = security_manager.get_client_ip(request)
        
        # Log incoming request
        middleware_logger.info(
            f"Request: {request.method} {request.url.path} from {client_ip}"
        )
        
        # Rate limiting check
        if not security_manager.rate_limit_check(
            request, 
            max_requests=self.rate_limit_requests,
            window_minutes=self.rate_limit_window
        ):
            middleware_logger.warning(
                f"Rate limit exceeded for {client_ip} on {request.url.path}"
            )
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Rate limit exceeded. Please try again later."}
            )
        
        # Content-Type validation for POST/PUT requests
        if request.method in ["POST", "PUT", "PATCH"]:
            content_type = request.headers.get("content-type", "")
            if not self._is_valid_content_type(content_type):
                middleware_logger.warning(
                    f"Invalid content type {content_type} from {client_ip}"
                )
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "Invalid content type"}
                )
        
        # Process request
        try:
            response = await call_next(request)
        except Exception as e:
            middleware_logger.error(
                f"Request processing error: {str(e)} for {client_ip}"
            )
            return JSONResponse(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                content={"detail": "Internal server error"}
            )
        
        # Add security headers
        for header_name, header_value in SECURITY_HEADERS.items():
            response.headers[header_name] = header_value
        
        # Log response
        process_time = time.time() - start_time
        middleware_logger.info(
            f"Response: {response.status_code} for {request.method} "
            f"{request.url.path} in {process_time:.3f}s"
        )
        
        return response
    
    def _is_valid_content_type(self, content_type: str) -> bool:
        """
        Validate content type for API requests
        """
        valid_types = [
            "application/json",
            "application/x-www-form-urlencoded",
            "multipart/form-data",
            "text/plain"
        ]
        
        # Extract main content type (ignore charset, boundary, etc.)
        main_type = content_type.split(';')[0].strip().lower()
        return main_type in valid_types

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """
    Detailed request logging middleware for security and debugging
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Log detailed request information
        """
        start_time = time.time()
        
        # Skip detailed logging for OPTIONS requests to avoid clutter
        if request.method == "OPTIONS":
            response = await call_next(request)
            return response
        
        # Collect request details
        request_details = {
            "method": request.method,
            "url": str(request.url),
            "path": request.url.path,
            "query_params": dict(request.query_params),
            "headers": dict(request.headers),
            "client_ip": security_manager.get_client_ip(request),
            "user_agent": request.headers.get("user-agent", "Unknown")
        }
        
        # Filter sensitive headers
        sensitive_headers = ["authorization", "cookie", "x-api-key"]
        for header in sensitive_headers:
            if header in request_details["headers"]:
                request_details["headers"][header] = "[REDACTED]"
        
        middleware_logger.info(f"Request details: {request_details}")
        
        # Process request
        response = await call_next(request)
        
        # Log response details
        process_time = time.time() - start_time
        response_details = {
            "status_code": response.status_code,
            "process_time": f"{process_time:.3f}s",
            "response_size": response.headers.get("content-length", "unknown")
        }
        
        middleware_logger.info(f"Response details: {response_details}")
        
        return response

class InputValidationMiddleware(BaseHTTPMiddleware):
    """
    Middleware to validate and sanitize input data
    """
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Validate and sanitize request input
        """
        # Check for common attack patterns in URL
        suspicious_patterns = [
            "../", "..\\", "<script", "javascript:", "onload=", "onerror=",
            "SELECT ", "UNION ", "DROP ", "INSERT ", "UPDATE ", "DELETE ",
            "exec(", "eval(", "system(", "os.system"
        ]
        
        url_path = request.url.path.lower()
        query_string = str(request.query_params).lower()
        
        for pattern in suspicious_patterns:
            if pattern.lower() in url_path or pattern.lower() in query_string:
                middleware_logger.error(
                    f"Suspicious request detected from {security_manager.get_client_ip(request)}: "
                    f"Pattern '{pattern}' found in {request.method} {request.url.path}"
                )
                return JSONResponse(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    content={"detail": "Invalid request"}
                )
        
        # Process request
        response = await call_next(request)
        return response

class CORSSecurityMiddleware(BaseHTTPMiddleware):
    """
    Enhanced CORS middleware with additional security checks
    """
    
    def __init__(self, app, allowed_origins: list = None):
        super().__init__(app)
        self.allowed_origins = allowed_origins or []
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Handle CORS with enhanced security
        """
        origin = request.headers.get("origin")
        
        # Check if origin is allowed
        if origin and self.allowed_origins:
            if origin not in self.allowed_origins:
                middleware_logger.warning(
                    f"CORS request from unauthorized origin: {origin}"
                )
                return JSONResponse(
                    status_code=status.HTTP_403_FORBIDDEN,
                    content={"detail": "Origin not allowed"}
                )
        
        # Handle preflight requests
        if request.method == "OPTIONS":
            response = Response()
            if origin in self.allowed_origins:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
                response.headers["Access-Control-Max-Age"] = "86400"  # 24 hours
            return response
        
        # Process regular request
        response = await call_next(request)
        
        # Add CORS headers to response
        if origin and origin in self.allowed_origins:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
        
        return response

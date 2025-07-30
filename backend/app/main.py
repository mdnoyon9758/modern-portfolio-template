import logging
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.db.database import engine
from app.models import models
from app.core.middleware import (
    SecurityMiddleware,
    RequestLoggingMiddleware,
    InputValidationMiddleware
)
from app.core.security import SECURITY_HEADERS

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app with enhanced security
app = FastAPI(
    title="Portfolio API",
    description="Secure Backend API for personal portfolio website",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if settings.ENVIRONMENT == "development" else None,
    docs_url=f"{settings.API_V1_STR}/docs" if settings.ENVIRONMENT == "development" else None,
    redoc_url=f"{settings.API_V1_STR}/redoc" if settings.ENVIRONMENT == "development" else None,
)

# Set up CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Add security middleware
app.add_middleware(SecurityMiddleware, rate_limit_requests=100, rate_limit_window=60)
app.add_middleware(InputValidationMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Add trusted host middleware for production
if settings.ENVIRONMENT == "production":
    # In production, specify allowed hosts
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=["yourdomain.com", "*.yourdomain.com"]
    )

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Portfolio API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

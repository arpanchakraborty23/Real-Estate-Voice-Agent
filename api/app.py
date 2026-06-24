# =============================================================================
# FastAPI Application Entry Point
# =============================================================================

import sys
import logging
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .src.config import APIServerConfig
from .src.services import init_db, close_db


# =============================================================================
# Logging Configuration
# Configure logging to output to stdout with timestamps and log levels.
# This helps with debugging and monitoring in production.
# =============================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

logger = logging.getLogger("real-estate-api")


# =============================================================================
# Application Lifespan Management
# =============================================================================
# The lifespan context manager handles startup and shutdown events.
# It ensures proper database initialization and cleanup.
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Manage application lifecycle events.
    
    This context manager runs code before the application starts
    yielding control to the router, and ensures cleanup code
    runs when the application shuts down.
    
    Startup:
        - Initialize database tables
        
    Shutdown:
        - Close database connections and dispose connection pool
    """
    logger.info("Starting Real Estate API")

    try:
        # Initialize database on startup
        await init_db()
        logger.info("Database connected")

        # Yield control to the application (requests can be handled)
        yield

    finally:
        # Cleanup on shutdown
        logger.info("Closing database connection")
        await close_db()


# =============================================================================
# FastAPI Application Instance
# =============================================================================
# Create the FastAPI application with metadata and configuration.
# =============================================================================

app = FastAPI(
    title="Real Estate API",
    version="0.0.1",
    lifespan=lifespan,
    debug=False
)


# =============================================================================
# Middleware Configuration
# =============================================================================
# CORS (Cross-Origin Resource Sharing) middleware allows the frontend
# application to communicate with this API from different origins.
# =============================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=APIServerConfig.CROS,
    allow_credentials=True,       # Allow cookies/auth headers
    allow_methods=["*"],          # Allow all HTTP methods
    allow_headers=["*"],          # Allow all HTTP headers
)



@app.get("/")
async def health():
    """
    Health check endpoint.
    
    Returns:
        dict: Status information about the API service
    """
    return {
        "status": "healthy",
        "service": "Real Estate API"
    }




if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=APIServerConfig.HOST,
        port=APIServerConfig.PORT,
        reload=True
    )
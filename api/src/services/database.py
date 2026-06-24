import asyncio
import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine, async_sessionmaker
from sqlalchemy.orm import DeclarativeMeta
from ..config.models import Base

from ..config import DatabaseConfig


# =============================================================================
# Database Service Module
# =============================================================================
# This module provides async database connection management for the API.
# It handles connection pooling, session creation, and lifecycle management.
# =============================================================================

import asyncio
import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine, async_sessionmaker
from sqlalchemy.orm import DeclarativeMeta
from ..config.models import Base

from ..config import DatabaseConfig


# Setup logger for this module
logger = logging.getLogger(__name__)


# =============================================================================
# Database Engine Configuration
# =============================================================================
# Create async engine with connection pooling settings.
# Pool settings help manage database connections efficiently.
# =============================================================================

engine: AsyncEngine = create_async_engine(
    DatabaseConfig.DATABASE_URL,
    pool_size=DatabaseConfig.POOL_SIZE,          # Number of connections to keep open
    max_overflow=20,                              # Additional connections when pool is full
    pool_pre_ping=True,                           # Verify connections before use
    echo=True                                     # Log SQL statements (disable in production)
)


# =============================================================================
# Session Factory
# =============================================================================
# Create async session maker for generating database sessions.
# Sessions are used to interact with the database.
# =============================================================================

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False                        # Keep objects accessible after commit
)

# =============================================================================
# Database Dependency
# =============================================================================

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency that provides an async database session.
    
    This function is used as a dependency in route handlers to inject
    database sessions. It includes automatic retry logic for handling
    transient connection errors.
    
    Yields:
        AsyncSession: SQLAlchemy async session for database operations
    
    Retry Logic:
        - Retries up to MAX_RETRIES times on connection failure
        - Exponential backoff between retry attempts
        - Logs warnings for each failed attempt
    
    Example:
        @router.get("/items")
        async def list_items(db: AsyncSession = Depends(get_db)):
            result = await db.execute(select(Item))
            return result.scalars().all()
    """
    last_exception = None
    for attempt in range(1, DatabaseConfig.MAX_RETRIES + 1):
        try:
            async with AsyncSessionLocal() as session:
                yield session
                await session.commit()
            return
        except Exception as exc:
            last_exception = exc
            logger.warning("DB attempt %d/%d failed: %s", attempt, DatabaseConfig.MAX_RETRIES, exc)
            if attempt < DatabaseConfig.MAX_RETRIES:
                # Exponential backoff: wait longer after each failed attempt
                await asyncio.sleep(DatabaseConfig.RETRY_DELYA_SEC * attempt)
    if last_exception:
        raise last_exception
    
    
# =============================================================================
# Database Lifecycle Functions
# =============================================================================

async def init_db():
    """
    Initialize database tables on application startup.
    
    This function creates all tables defined by SQLAlchemy models
    if they don't already exist. Should be called during application
    startup in the lifespan context manager.
    
    Note:
        Uses run_sync to execute synchronous metadata operations
        within the async engine context.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created / verified.")


async def close_db():
    """
    Clean up database connections on application shutdown.
    
    This function disposes of the connection pool, ensuring all
    connections are properly closed. Should be called during
    application shutdown.
    """
    await engine.dispose()
    logger.info("Database engine disposed.")
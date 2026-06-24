import asyncio
import logging
from typing import AsyncGenerator

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, AsyncEngine, async_sessionmaker
from sqlalchemy.orm import DeclarativeMeta
from ..config.models import Base

from ..config import DatabaseConfig


# Setup logger
logger = logging.getLogger(__name__)


engine: AsyncEngine = create_async_engine(
    DatabaseConfig.DATABASE_URL,
    pool_size=DatabaseConfig.POOL_SIZE,
    max_overflow=20,
    pool_pre_ping=True,
    echo=True
    )

# Session Maker
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    last_exception = None
    for attempt in range(1,DatabaseConfig.MAX_RETRIES + 1):
        try:
            async with AsyncSessionLocal() as session:
                yield session
                await session.commit()
            return
        except Exception as exc:
            last_exception = exc
            logger.warning("DB attempt %d/%d failed: %s", attempt, DatabaseConfig.MAX_RETRIES, exc)
            if attempt < DatabaseConfig.MAX_RETRIES:
                await asyncio.sleep(DatabaseConfig.RETRY_DELYA_SEC * attempt)
    if last_exception:
        raise last_exception
    


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables created / verified.")

async def close_db():
    await engine.dispose()
    logger.info("Database engine disposed.")
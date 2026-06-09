from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

from .constant import Config

Database_URL = Config.DATABASE_URL

engine = create_engine(
    Database_URL,
    pool_size=10,
    max_overflow=20,
    )

# Session factory
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

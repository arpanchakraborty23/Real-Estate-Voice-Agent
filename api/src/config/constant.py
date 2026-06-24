# =============================================================================
# Configuration Module
# =============================================================================
# This module handles application configuration using Pydantic Settings.
# Configuration values are loaded from environment variables and .env file.
# =============================================================================

from pydantic_settings import BaseSettings, SettingsConfigDict



class APIServerConfig(BaseSettings):
    """
    FastAPI server Configuration settings.
    """
    CROS :list =[]
    PORT: int 
    HOST: str = ""
    CLERK_JWKS_URL: str = ""

    model_config =  SettingsConfigDict(
        env_file='.env',
        extra='ignore'
    )

class DatabaseConfig(BaseSettings):
    """
    Database configuration settings.

    Attributes:
        DATABASE_URL: Database connection string (e.g., sqlite+aiosqlite:///db.sqlite)
        MAX_RETRIES: Maximum number of connection retry attempts
        RETRY_DELYA_SEC: Delay between retry attempts (in seconds)
        POOL_SIZE: Number of connections in the database pool
    """
    
    DATABASE_URL: str = ""
    MAX_RETRIES: int = 3
    RETRY_DELYA_SEC: float = 1.0
    POOL_SIZE: int = 20

    model_config = SettingsConfigDict(
        env_file='.env',
        extra='ignore'
    )


class LivekitConfig(BaseSettings):
    LIVEKIT_URL: str = ""
    LIVEKIT_API_KEY: str = ""
    LIVEKIT_API_SECRET = ""

    model_config = SettingsConfigDict(
        env_file='.env',
        extra='ignore'
    )
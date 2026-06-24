from pydantic_settings import BaseSettings, SettingsConfigDict

class DatabaseConfig(BaseSettings):
    DATABASE_URL: str =""
    MAX_RETRIES: int = 3
    RETRY_DELYA_SEC: float = 1.0
    POOL_SIZE: int = 20 

    model_config = SettingsConfigDict(
        env_file='.env',
        extra='ignore'
    )



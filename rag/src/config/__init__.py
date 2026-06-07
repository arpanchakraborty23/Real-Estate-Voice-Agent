from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Real Estate RAG API"
    api_prefix: str = "/api"
    host: str = "0.0.0.0"
    port: int = 8000

    embedding_model: str = "text-embedding-3-small"
    vector_dimension: int = 1536
    top_k_default: int = 5

    class Config:
        env_file = ".env"


settings = Settings()

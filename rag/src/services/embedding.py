"""Embedding service - stub for development.

Replace with OpenAI / local model for production.
"""

from src.config import settings


class EmbeddingService:
    def __init__(self) -> None:
        self.dimension = settings.vector_dimension

    async def embed(self, text: str) -> list[float]:
        """Generate embedding vector for text.

        Returns a dummy vector of correct dimension for development.
        """
        import hashlib

        hash_bytes = hashlib.sha256(text.encode()).digest()
        vec = [b / 255.0 for b in hash_bytes[: self.dimension]]
        norm = sum(x * x for x in vec) ** 0.5
        return [x / norm for x in vec] if norm else vec

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        return [await self.embed(t) for t in texts]


embedding_service = EmbeddingService()

"""In-memory data store with basic vector search for development.

Replace with Chroma, Qdrant, or Pinecone for production.
"""

from uuid import UUID

from src.models.builder import Builder
from src.models.inquiry import Inquiry
from src.models.property import Property


class PropertyStore:
    def __init__(self) -> None:
        self._properties: dict[UUID, Property] = {}
        self._builders: dict[UUID, Builder] = {}
        self._inquiries: dict[UUID, Inquiry] = {}
        self._embeddings: dict[UUID, list[float]] = {}

    # --- Properties ---

    def add_property(self, prop: Property) -> Property:
        self._properties[prop.id] = prop
        return prop

    def get_property(self, prop_id: UUID) -> Property | None:
        return self._properties.get(prop_id)

    def list_properties(
        self,
        city: str | None = None,
        type_filter: str | None = None,
        status_filter: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
    ) -> list[Property]:
        results = list(self._properties.values())
        if city:
            results = [p for p in results if p.city.lower() == city.lower()]
        if type_filter:
            results = [p for p in results if p.type.value == type_filter]
        if status_filter:
            results = [p for p in results if p.status.value == status_filter]
        if min_price is not None:
            results = [p for p in results if float(p.price) >= min_price]
        if max_price is not None:
            results = [p for p in results if float(p.price) <= max_price]
        return results

    def update_property(self, prop_id: UUID, updates: dict) -> Property | None:
        prop = self._properties.get(prop_id)
        if not prop:
            return None
        for key, value in updates.items():
            if value is not None and hasattr(prop, key):
                setattr(prop, key, value)
        return prop

    def delete_property(self, prop_id: UUID) -> bool:
        self._embeddings.pop(prop_id, None)
        return self._properties.pop(prop_id, None) is not None

    def set_embedding(self, prop_id: UUID, embedding: list[float]) -> None:
        self._embeddings[prop_id] = embedding

    def search_by_vector(
        self, query_embedding: list[float], top_k: int = 5
    ) -> list[tuple[Property, float]]:
        import math

        scored: list[tuple[UUID, float]] = []
        for pid, emb in self._embeddings.items():
            dot = sum(a * b for a, b in zip(query_embedding, emb))
            norm_q = math.sqrt(sum(x * x for x in query_embedding))
            norm_e = math.sqrt(sum(x * x for x in emb))
            sim = dot / (norm_q * norm_e) if norm_q and norm_e else 0.0
            scored.append((pid, sim))

        scored.sort(key=lambda x: x[1], reverse=True)
        results = []
        for pid, score in scored[:top_k]:
            prop = self._properties.get(pid)
            if prop:
                results.append((prop, score))
        return results

    # --- Builders ---

    def add_builder(self, builder: Builder) -> Builder:
        self._builders[builder.id] = builder
        return builder

    def get_builder(self, builder_id: UUID) -> Builder | None:
        return self._builders.get(builder_id)

    def list_builders(self) -> list[Builder]:
        return list(self._builders.values())

    def update_builder(self, builder_id: UUID, updates: dict) -> Builder | None:
        builder = self._builders.get(builder_id)
        if not builder:
            return None
        for key, value in updates.items():
            if value is not None and hasattr(builder, key):
                setattr(builder, key, value)
        return builder

    # --- Inquiries ---

    def add_inquiry(self, inquiry: Inquiry) -> Inquiry:
        self._inquiries[inquiry.id] = inquiry
        return inquiry

    def list_inquiries(self) -> list[Inquiry]:
        return list(self._inquiries.values())

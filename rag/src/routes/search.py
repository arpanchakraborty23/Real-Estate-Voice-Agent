from fastapi import APIRouter, Query

from src.models.property import PropertySearchResult
from src.services import property_store
from src.services.embedding import embedding_service

router = APIRouter(prefix="/search", tags=["Search"])


@router.post("", response_model=list[PropertySearchResult])
async def search_properties(
    query: str = Query(..., min_length=1, max_length=500),
    top_k: int = Query(5, ge=1, le=20),
):
    embedding = await embedding_service.embed(query)
    results = property_store.search_by_vector(embedding, top_k=top_k)

    return [
        PropertySearchResult(
            id=p.id,
            name=p.name,
            builder_name=p.builder_name,
            type=p.type,
            location=p.location,
            city=p.city,
            price=p.price,
            size_sqft=p.size_sqft,
            bedrooms=p.bedrooms,
            status=p.status,
            score=round(score, 4),
        )
        for p, score in results
    ]

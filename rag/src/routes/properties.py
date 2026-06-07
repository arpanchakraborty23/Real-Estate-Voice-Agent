from uuid import UUID

from fastapi import APIRouter, HTTPException, Query

from src.models.property import Property, PropertyCreate, PropertyUpdate, StatusType
from src.services import property_store
from src.services.embedding import embedding_service

router = APIRouter(prefix="/properties", tags=["Properties"])


@router.post("", response_model=Property, status_code=201)
async def create_property(body: PropertyCreate):
    prop = Property(**body.model_dump())
    property_store.add_property(prop)
    embedding = await embedding_service.embed(
        f"{prop.name} {prop.description} {prop.location} {prop.city} {','.join(prop.amenities)}"
    )
    property_store.set_embedding(prop.id, embedding)
    return prop


@router.get("", response_model=list[Property])
async def list_properties(
    city: str | None = Query(None),
    type: str | None = Query(None, alias="type"),
    status: StatusType | None = Query(None),
    min_price: float | None = Query(None, ge=0),
    max_price: float | None = Query(None, ge=0),
):
    return property_store.list_properties(
        city=city,
        type_filter=type,
        status_filter=status.value if status else None,
        min_price=min_price,
        max_price=max_price,
    )


@router.get("/{property_id}", response_model=Property)
async def get_property(property_id: UUID):
    prop = property_store.get_property(property_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


@router.put("/{property_id}", response_model=Property)
async def update_property(property_id: UUID, body: PropertyUpdate):
    updates = body.model_dump(exclude_unset=True)
    prop = property_store.update_property(property_id, updates)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if any(
        k in updates for k in ("name", "description", "location", "city", "amenities")
    ):
        embedding = await embedding_service.embed(
            f"{prop.name} {prop.description} {prop.location} {prop.city} {','.join(prop.amenities)}"
        )
        property_store.set_embedding(prop.id, embedding)
    return prop


@router.delete("/{property_id}", status_code=204)
async def delete_property(property_id: UUID):
    if not property_store.delete_property(property_id):
        raise HTTPException(status_code=404, detail="Property not found")

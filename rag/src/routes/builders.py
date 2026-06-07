from uuid import UUID

from fastapi import APIRouter, HTTPException

from src.models.builder import Builder, BuilderCreate, BuilderUpdate
from src.services import property_store

router = APIRouter(prefix="/builders", tags=["Builders"])


@router.post("", response_model=Builder, status_code=201)
async def create_builder(body: BuilderCreate):
    builder = Builder(**body.model_dump())
    return property_store.add_builder(builder)


@router.get("", response_model=list[Builder])
async def list_builders():
    return property_store.list_builders()


@router.get("/{builder_id}", response_model=Builder)
async def get_builder(builder_id: UUID):
    builder = property_store.get_builder(builder_id)
    if not builder:
        raise HTTPException(status_code=404, detail="Builder not found")
    return builder


@router.put("/{builder_id}", response_model=Builder)
async def update_builder(builder_id: UUID, body: BuilderUpdate):
    updates = body.model_dump(exclude_unset=True)
    builder = property_store.update_builder(builder_id, updates)
    if not builder:
        raise HTTPException(status_code=404, detail="Builder not found")
    return builder

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .database import SessionLocal
from .models import Property, Builder
from .schemas import (
    PropertyCreate, PropertyResponse, PropertyUpdate,
    BuilderCreate, BuilderResponse,
    RecommendRequest, RecommendResponse,
)

router = APIRouter(prefix="/api")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── Builder CRUD ────────────────────────────────────────────────────────────

@router.get("/builders", response_model=List[BuilderResponse])
def list_builders(db: Session = Depends(get_db)):
    return db.query(Builder).all()


@router.get("/builders/{builder_id}", response_model=BuilderResponse)
def get_builder(builder_id: str, db: Session = Depends(get_db)):
    builder = db.query(Builder).filter_by(builder_id=builder_id).first()
    if not builder:
        raise HTTPException(404, "Builder not found")
    return builder


@router.post("/builders", response_model=BuilderResponse, status_code=201)
def create_builder(data: BuilderCreate, db: Session = Depends(get_db)):
    if db.query(Builder).filter_by(builder_id=data.builder_id).first():
        raise HTTPException(400, "Builder already exists")
    builder = Builder(**data.model_dump())
    db.add(builder)
    db.commit()
    db.refresh(builder)
    return builder


@router.delete("/builders/{builder_id}", status_code=204)
def delete_builder(builder_id: str, db: Session = Depends(get_db)):
    builder = db.query(Builder).filter_by(builder_id=builder_id).first()
    if not builder:
        raise HTTPException(404, "Builder not found")
    db.delete(builder)
    db.commit()


# ─── Property CRUD ──────────────────────────────────────────────────────────

@router.get("/properties", response_model=List[PropertyResponse])
def list_properties(
    builder_id: str = None,
    property_type: str = None,
    min_price: float = None,
    max_price: float = None,
    min_bedrooms: int = None,
    location: str = None,
    status: str = None,
    db: Session = Depends(get_db),
):
    q = db.query(Property)
    if builder_id:
        q = q.filter_by(builder_id=builder_id)
    if property_type:
        q = q.filter_by(property_type=property_type)
    if min_price is not None:
        q = q.filter(Property.price >= min_price)
    if max_price is not None:
        q = q.filter(Property.price <= max_price)
    if min_bedrooms is not None:
        q = q.filter(Property.bedrooms >= min_bedrooms)
    if location:
        q = q.filter(Property.location.ilike(f"%{location}%"))
    if status:
        q = q.filter_by(status=status)
    return q.all()


@router.get("/properties/{property_id}", response_model=PropertyResponse)
def get_property(property_id: str, db: Session = Depends(get_db)):
    prop = db.query(Property).filter_by(property_id=property_id).first()
    if not prop:
        raise HTTPException(404, "Property not found")
    return prop


@router.post("/properties", response_model=PropertyResponse, status_code=201)
def create_property(data: PropertyCreate, db: Session = Depends(get_db)):
    if db.query(Property).filter_by(property_id=data.property_id).first():
        raise HTTPException(400, "Property already exists")
    if not db.query(Builder).filter_by(builder_id=data.builder_id).first():
        raise HTTPException(400, "Builder does not exist")
    prop = Property(**data.model_dump())
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


@router.put("/properties/{property_id}", response_model=PropertyResponse)
def update_property(property_id: str, data: PropertyUpdate, db: Session = Depends(get_db)):
    prop = db.query(Property).filter_by(property_id=property_id).first()
    if not prop:
        raise HTTPException(404, "Property not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(prop, field, value)
    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/properties/{property_id}", status_code=204)
def delete_property(property_id: str, db: Session = Depends(get_db)):
    prop = db.query(Property).filter_by(property_id=property_id).first()
    if not prop:
        raise HTTPException(404, "Property not found")
    db.delete(prop)
    db.commit()


# ─── Recommendation ─────────────────────────────────────────────────────────

@router.post("/recommend", response_model=List[RecommendResponse])
def recommend_properties(data: RecommendRequest, db: Session = Depends(get_db)):
    q = db.query(Property).filter(Property.status == data.status)

    properties = q.all()
    scored = []

    for p in properties:
        score = 0.0

        if data.budget_min is not None and data.budget_max is not None:
            if data.budget_min <= p.price <= data.budget_max:
                score += 3
            elif p.price < data.budget_min:
                score -= 1
            elif p.price > data.budget_max:
                score -= 2
        elif data.budget_min is not None and p.price >= data.budget_min:
            score += 1
        elif data.budget_max is not None and p.price <= data.budget_max:
            score += 1

        if data.bedrooms is not None:
            if p.bedrooms == data.bedrooms:
                score += 2
            elif p.bedrooms is not None and p.bedrooms >= data.bedrooms:
                score += 1

        if data.location and p.location:
            if data.location.lower() in p.location.lower():
                score += 2
            elif p.location and any(w in p.location.lower() for w in data.location.lower().split()):
                score += 1

        if data.property_type and p.property_type:
            if p.property_type.lower() == data.property_type.lower():
                score += 2

        if data.amenities and p.amenities:
            wanted = [a.strip().lower() for a in data.amenities.split(",")]
            amenity_list = [a.strip().lower() for a in p.amenities.split(";")]
            matches = sum(1 for w in wanted if w in amenity_list)
            score += matches * 1.5

        if score > 0:
            scored.append((score, p))

    scored.sort(key=lambda x: x[0], reverse=True)
    scored = scored[:data.top_k]

    return [
        RecommendResponse(property=PropertyResponse.model_validate(p), score=round(s, 1))
        for s, p in scored
    ]

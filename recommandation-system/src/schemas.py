from pydantic import BaseModel
from typing import Optional


class BuilderBase(BaseModel):
    builder_id: str
    builder_name: str
    builder_phone: Optional[str] = None
    builder_email: Optional[str] = None


class BuilderCreate(BuilderBase):
    pass


class BuilderResponse(BuilderBase):
    class Config:
        from_attributes = True


class PropertyBase(BaseModel):
    property_id: str
    builder_id: str
    project_name: str
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    location: Optional[str] = None
    price: float
    status: Optional[str] = "available"
    amenities: Optional[str] = None
    description: Optional[str] = None


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    project_name: Optional[str] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    location: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None
    amenities: Optional[str] = None
    description: Optional[str] = None


class PropertyResponse(PropertyBase):
    class Config:
        from_attributes = True


class RecommendRequest(BaseModel):
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    bedrooms: Optional[int] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    amenities: Optional[str] = None
    status: Optional[str] = "available"
    top_k: Optional[int] = 10


class RecommendResponse(BaseModel):
    property: PropertyResponse
    score: float

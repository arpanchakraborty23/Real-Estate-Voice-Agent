from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from uuid import UUID, uuid4

from pydantic import BaseModel, Field, field_validator


class PropertyType(str, Enum):
    APARTMENT = "apartment"
    VILLA = "villa"
    PLOT = "plot"
    COMMERCIAL = "commercial"


class StatusType(str, Enum):
    READY_TO_MOVE = "ready_to_move"
    UNDER_CONSTRUCTION = "under_construction"
    UPCOMING = "upcoming"


class PropertyCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, description="Property name")
    builder_id: UUID = Field(..., description="Builder UUID")
    builder_name: str = Field(..., min_length=1, max_length=200)
    type: PropertyType
    location: str = Field(..., min_length=1, max_length=500)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    price: Decimal = Field(..., gt=0, decimal_places=2, description="Price in INR")
    size_sqft: float = Field(..., gt=0, description="Super built-up area in sq ft")
    bedrooms: int = Field(..., ge=0, le=50, description="Number of bedrooms")
    bathrooms: int = Field(..., ge=0, le=50, description="Number of bathrooms")
    amenities: list[str] = Field(default_factory=list, max_length=50)
    description: str = Field(..., min_length=10, max_length=5000)
    status: StatusType = StatusType.UNDER_CONSTRUCTION
    images: list[str] = Field(default_factory=list, max_length=20)

    @field_validator("price")
    @classmethod
    def price_max(cls, v: Decimal) -> Decimal:
        if v > Decimal("999999999999.99"):
            raise ValueError("Price exceeds maximum allowed value")
        return v

    @field_validator("images")
    @classmethod
    def validate_urls(cls, v: list[str]) -> list[str]:
        for url in v:
            if not url.startswith(("http://", "https://")):
                raise ValueError(f"Invalid image URL: {url}")
        return v


class PropertyUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    type: PropertyType | None = None
    location: str | None = Field(None, min_length=1, max_length=500)
    city: str | None = Field(None, min_length=1, max_length=100)
    state: str | None = Field(None, min_length=1, max_length=100)
    price: Decimal | None = Field(None, gt=0, decimal_places=2)
    size_sqft: float | None = Field(None, gt=0)
    bedrooms: int | None = Field(None, ge=0, le=50)
    bathrooms: int | None = Field(None, ge=0, le=50)
    amenities: list[str] | None = Field(None, max_length=50)
    description: str | None = Field(None, min_length=10, max_length=5000)
    status: StatusType | None = None
    images: list[str] | None = Field(None, max_length=20)


class Property(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    builder_id: UUID
    builder_name: str
    type: PropertyType
    location: str
    city: str
    state: str
    price: Decimal
    size_sqft: float
    bedrooms: int
    bathrooms: int
    amenities: list[str] = []
    description: str
    status: StatusType
    images: list[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PropertySearchResult(BaseModel):
    id: UUID
    name: str
    builder_name: str
    type: PropertyType
    location: str
    city: str
    price: Decimal
    size_sqft: float
    bedrooms: int
    status: StatusType
    score: float = Field(..., ge=0, le=1, description="Semantic similarity score")

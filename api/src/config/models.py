# =============================================================================
# SQLAlchemy ORM Models
# =============================================================================
# This module defines the database schema using SQLAlchemy's ORM.
# Models represent database tables and their relationships.
# =============================================================================

from datetime import datetime
from typing import Optional, List
from uuid import UUID, uuid4

from sqlmodel import SQLModel, Field, Relationship

Base = SQLModel


# =============================================================================
# User Table
# =============================================================================
# Stores user information. Each user can be either a buyer or a builder.
# - clerk_user_id: Unique identifier from Clerk authentication service
# - role: User type - "buyer" (default) or "builder"
# - Relationships: One user can have one builder profile
# =============================================================================
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Unique ID from Clerk auth service (used for authentication)
    clerk_user_id: str = Field(index=True, unique=True)
    email: str = Field(index=True)

    first_name: Optional[str] = None
    last_name: Optional[str] = None

    phone: Optional[str] = None

    # User role: "buyer" (default) or "builder"
    role: str = Field(default="buyer")

    profile_image: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # One user can have one builder profile (optional, only if role="builder")
    builder: Optional["Builder"] = Relationship(back_populates="user")


# =============================================================================
# Builder Table
# =============================================================================
# Stores builder/real estate company information.
# - Linked to User table via user_id (one-to-one relationship)
# - A builder can have multiple properties listed
# =============================================================================
class Builder(SQLModel, table=True):
    __tablename__ = "builders"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key to User table - each builder profile belongs to one user
    user_id: UUID = Field(foreign_key="users.id")

    company_name: str

    company_email: Optional[str] = None
    company_phone: Optional[str] = None

    website: Optional[str] = None

    description: Optional[str] = None

    address: Optional[str] = None

    city: Optional[str] = None
    state: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Reverse relationship: each builder belongs to one user
    user: User = Relationship(back_populates="builder")

    # One builder can have many properties listed
    properties: List["Property"] = Relationship(
        back_populates="builder"
    )


# =============================================================================
# Property Table
# =============================================================================
# Stores property listings from builders.
# - Each property belongs to one builder
# - Can have multiple images associated with it
# - Status: "available" (default), "sold", "rented", etc.
# =============================================================================
class Property(SQLModel, table=True):
    __tablename__ = "properties"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key to Builder table - each property is listed by one builder
    builder_id: UUID = Field(
        foreign_key="builders.id"
    )

    title: str  # Property title/advertisement headline

    project_name: str  # Name of the housing project/society

    property_type: str  # "apartment", "villa", "plot", "commercial", etc.

    description: Optional[str] = None

    bedrooms: Optional[int] = None  # Number of bedrooms
    bathrooms: Optional[int] = None  # Number of bathrooms

    area_sqft: Optional[int] = None  # Area in square feet

    floor_number: Optional[int] = None  # Floor number (for apartments)

    price: float  # Property price

    # Property status: "available" (default), "sold", "rented", "under_construction"
    status: str = "available"

    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None

    # Geographic coordinates for map display
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )

    # Reverse relationship: each property belongs to one builder
    builder: Builder = Relationship(
        back_populates="properties"
    )

    # One property can have many images
    images: List["PropertyImage"] = Relationship(
        back_populates="property"
    )


# =============================================================================
# PropertyImage Table
# =============================================================================
# Stores images for properties.
# - Each image belongs to one property
# - is_primary: Marks the main image to display in listings
# =============================================================================
class PropertyImage(SQLModel, table=True):
    __tablename__ = "property_images"

    id: UUID = Field(default_factory=uuid4, primary_key=True)

    # Foreign key to Property table - each image belongs to one property
    property_id: UUID = Field(
        foreign_key="properties.id"
    )

    image_url: str  # URL to the image file

    # True if this is the main property image to show in listings
    is_primary: bool = False

    created_at: datetime = Field(
        default_factory=datetime.utcnow
    )

    # Reverse relationship: each image belongs to one property
    property: Property = Relationship(
        back_populates="images"
    )
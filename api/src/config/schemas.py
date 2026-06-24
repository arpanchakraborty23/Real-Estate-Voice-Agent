# =============================================================================
# Pydantic Schemas
# =============================================================================
# This module defines request/response schemas using Pydantic.
# Schemas validate API input/output and handle data serialization.
# =============================================================================

from pydantic import BaseModel
from typing import Optional


# -----------------------------------------------------------------------------
# Builder Schemas
# -----------------------------------------------------------------------------

class BuilderBase(BaseModel):
    """
    Base schema for Builder data.
    
    This schema defines the common fields shared between
    create and response schemas for Builder.
    
    Attributes:
        builder_id: Unique identifier for the builder
        builder_name: Name of the builder/company
        builder_phone: Contact phone number (optional)
        builder_email: Contact email address (optional)
    """
    
    builder_id: str
    builder_name: str
    builder_phone: Optional[str] = None
    builder_email: Optional[str] = None


class BuilderCreate(BuilderBase):
    """
    Schema for creating a new Builder.
    
    Inherits all fields from BuilderBase. Used when POSTing
    new builder data to the API.
    """
    pass


class BuilderResponse(BuilderBase):
    """
    Schema for Builder API responses.
    
    Inherits from BuilderBase and configures Pydantic to read
    attributes from SQLAlchemy ORM models.
    """
    
    class Config:
        from_attributes = True


# -----------------------------------------------------------------------------
# Property Schemas
# -----------------------------------------------------------------------------

class PropertyBase(BaseModel):
    """
    Base schema for Property data.
    
    Defines common fields shared between create, update,
    and response schemas for Property.
    
    Attributes:
        property_id: Unique identifier for the property
        builder_id: Foreign key to the builder
        project_name: Name of the property/project
        property_type: Type of property (optional)
        bedrooms: Number of bedrooms (optional)
        location: Physical location (optional)
        price: Price of the property
        status: Availability status (default: 'available')
        amenities: List of amenities (optional)
        description: Property description (optional)
    """
    
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
    """
    Schema for creating a new Property.
    
    Inherits all fields from PropertyBase. Used when POSTing
    new property data to the API.
    """
    pass


class PropertyUpdate(BaseModel):
    """
    Schema for updating an existing Property.
    
    All fields are optional to allow partial updates.
    Only provided fields will be updated in the database.
    
    Attributes:
        project_name: Updated project name
        property_type: Updated property type
        bedrooms: Updated bedroom count
        location: Updated location
        price: Updated price
        status: Updated status
        amenities: Updated amenities
        description: Updated description
    """
    
    project_name: Optional[str] = None
    property_type: Optional[str] = None
    bedrooms: Optional[int] = None
    location: Optional[str] = None
    price: Optional[float] = None
    status: Optional[str] = None
    amenities: Optional[str] = None
    description: Optional[str] = None


class PropertyResponse(PropertyBase):
    """
    Schema for Property API responses.
    
    Inherits from PropertyBase and configures Pydantic to read
    attributes from SQLAlchemy ORM models.
    """
    
    class Config:
        from_attributes = True


# -----------------------------------------------------------------------------
# Recommendation Schemas
# -----------------------------------------------------------------------------

class RecommendRequest(BaseModel):
    """
    Schema for property recommendation requests.
    
    Used by clients to request property recommendations based on
    their preferences and filters.
    
    Attributes:
        budget_min: Minimum budget (optional)
        budget_max: Maximum budget (optional)
        bedrooms: Desired number of bedrooms (optional)
        location: Preferred location (optional)
        property_type: Type of property desired (optional)
        amenities: Desired amenities (optional)
        status: Property status filter (default: 'available')
        top_k: Number of recommendations to return (default: 10)
    """
    
    budget_min: Optional[float] = None
    budget_max: Optional[float] = None
    bedrooms: Optional[int] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    amenities: Optional[str] = None
    status: Optional[str] = "available"
    top_k: Optional[int] = 10


class RecommendResponse(BaseModel):
    """
    Schema for property recommendation responses.
    
    Contains the recommended property and a relevance score.
    
    Attributes:
        property: The recommended property details
        score: Relevance score (higher = better match)
    """
    
    property: PropertyResponse
    score: float

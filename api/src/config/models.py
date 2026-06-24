# =============================================================================
# SQLAlchemy ORM Models
# =============================================================================
# This module defines the database schema using SQLAlchemy's ORM.
# Models represent database tables and their relationships.
# =============================================================================

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    """
    Base class for all ORM models.
    
    All database models should inherit from this class to enable
    automatic table creation and declarative configuration.
    """
    pass


class Builder(Base):
    """
    Builder/Developer model representing property developers.
    
    This model stores information about builders/developers who own
    or manage properties in the system.
    
    Attributes:
        builder_id: Unique identifier for the builder (primary key)
        builder_name: Name of the builder/company (required)
        builder_phone: Contact phone number
        builder_email: Contact email address
        properties: Related properties managed by this builder
    """
    
    __tablename__ = 'builders'

    builder_id = Column(String, primary_key=True, index=True)
    builder_name = Column(String, nullable=False)
    builder_phone = Column(String)
    builder_email = Column(String)

    # Relationship to properties - one builder has many properties
    properties = relationship("Property", back_populates="builder")


class Property(Base):
    """
    Property model representing real estate listings.
    
    This model stores detailed information about properties including
    pricing, location, amenities, and status.
    
    Attributes:
        property_id: Unique identifier for the property (primary key)
        builder_id: Foreign key to the builder who owns this property
        project_name: Name of the property/project (required)
        property_type: Type of property (apartment, villa, etc.)
        bedrooms: Number of bedrooms
        location: Physical location/address
        price: Price of the property (required)
        status: Current availability status (default: 'available')
        amenities: Comma-separated list of amenities
        description: Detailed description of the property
        created_at: Timestamp when the property was added
        builder: Related builder information
    """
    
    __tablename__ = 'properties'

    property_id = Column(String, primary_key=True, index=True)
    builder_id = Column(String, ForeignKey('builders.builder_id'), nullable=False)
    project_name = Column(String, nullable=False)
    property_type = Column(String)
    bedrooms = Column(Integer)
    location = Column(String)
    price = Column(Float, nullable=False)
    status = Column(String, default='available')
    amenities = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship back to builder - many properties belong to one builder
    builder = relationship("Builder", back_populates="properties")

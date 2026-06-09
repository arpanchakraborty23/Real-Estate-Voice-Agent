from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class Builder(Base):
    __tablename__ = 'builders'

    builder_id = Column(String, primary_key=True, index=True)
    builder_name = Column(String, nullable=False)
    builder_phone = Column(String)
    builder_email = Column(String)

    properties = relationship("Property", back_populates="builder")


class Property(Base):
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

    builder = relationship("Builder", back_populates="properties")

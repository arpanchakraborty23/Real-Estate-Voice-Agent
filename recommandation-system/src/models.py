from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass

class Property(Base):
    __tablename__ = 'properties'

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    bedrooms = Column(Integer)
    bathrooms = Column(Float)
    square_feet = Column(Float)
    property_type = Column(String)
    description = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

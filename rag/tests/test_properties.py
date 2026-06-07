"""Minimal validation tests for property API models."""

import pytest
from pydantic import ValidationError

from src.models.property import PropertyCreate


class TestPropertyCreate:
    def test_valid_property(self):
        data = {
            "name": "Green Valley Apartments",
            "builder_id": "00000000-0000-0000-0000-000000000001",
            "builder_name": "ABC Builders",
            "type": "apartment",
            "location": "HSR Layout, Sector 3",
            "city": "Bangalore",
            "state": "Karnataka",
            "price": "7500000.00",
            "size_sqft": 1200.0,
            "bedrooms": 2,
            "bathrooms": 2,
            "description": "A beautiful 2 BHK apartment in the heart of HSR Layout with modern amenities.",
            "status": "under_construction",
            "amenities": ["pool", "gym", "parking"],
            "images": ["https://example.com/img1.jpg"],
        }
        prop = PropertyCreate(**data)
        assert prop.name == "Green Valley Apartments"

    def test_empty_name_fails(self):
        with pytest.raises(ValidationError):
            PropertyCreate(
                name="",
                builder_id="00000000-0000-0000-0000-000000000001",
                builder_name="Builder",
                type="apartment",
                location="Loc",
                city="City",
                state="State",
                price="1000000.00",
                size_sqft=1000.0,
                bedrooms=2,
                bathrooms=1,
                description="A valid description with enough characters.",
            )

    def test_negative_price_fails(self):
        with pytest.raises(ValidationError):
            PropertyCreate(
                name="Test Property",
                builder_id="00000000-0000-0000-0000-000000000001",
                builder_name="Builder",
                type="villa",
                location="Loc",
                city="City",
                state="State",
                price="-100.00",
                size_sqft=1000.0,
                bedrooms=3,
                bathrooms=2,
                description="A valid description with enough characters for testing.",
            )

    def test_invalid_image_url_fails(self):
        with pytest.raises(ValidationError):
            PropertyCreate(
                name="Test",
                builder_id="00000000-0000-0000-0000-000000000001",
                builder_name="Builder",
                type="apartment",
                location="Loc",
                city="City",
                state="State",
                price="5000000.00",
                size_sqft=1000.0,
                bedrooms=2,
                bathrooms=1,
                description="A valid description with enough characters.",
                images=["ftp://bad.com/img.jpg"],
            )

    def test_short_description_fails(self):
        with pytest.raises(ValidationError):
            PropertyCreate(
                name="Test",
                builder_id="00000000-0000-0000-0000-000000000001",
                builder_name="Builder",
                type="plot",
                location="Loc",
                city="City",
                state="State",
                price="5000000.00",
                size_sqft=1000.0,
                bedrooms=0,
                bathrooms=0,
                description="Short",
            )

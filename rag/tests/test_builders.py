"""Minimal validation tests for builder API models."""

import pytest
from pydantic import ValidationError

from src.models.builder import BuilderCreate


class TestBuilderCreate:
    def test_valid_builder(self):
        data = {
            "name": "Rajesh Kumar",
            "email": "rajesh@example.com",
            "phone": "+919876543210",
            "company_name": "ABC Builders Pvt Ltd",
            "description": "Premium real estate developer with 20 years of experience.",
        }
        builder = BuilderCreate(**data)
        assert builder.name == "Rajesh Kumar"

    def test_invalid_phone_fails(self):
        with pytest.raises(ValidationError):
            BuilderCreate(
                name="Test",
                email="test@example.com",
                phone="123",
                company_name="Test Corp",
                description="A valid description with enough characters here.",
            )

    def test_invalid_email_fails(self):
        with pytest.raises(ValidationError):
            BuilderCreate(
                name="Test",
                email="not-an-email",
                phone="+919876543210",
                company_name="Test Corp",
                description="A valid description with enough characters here.",
            )

    def test_invalid_website_fails(self):
        with pytest.raises(ValidationError):
            BuilderCreate(
                name="Test",
                email="test@example.com",
                phone="+919876543210",
                company_name="Test Corp",
                description="A valid description with enough characters here.",
                website="not-a-url",
            )

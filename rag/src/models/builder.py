from datetime import datetime, timezone
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, Field, field_validator


class BuilderCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")
    company_name: str = Field(..., min_length=1, max_length=200)
    website: str | None = Field(None, max_length=500)
    description: str = Field(..., min_length=10, max_length=2000)

    @field_validator("website")
    @classmethod
    def validate_website(cls, v: str | None) -> str | None:
        if v and not v.startswith(("http://", "https://")):
            raise ValueError("Website must start with http:// or https://")
        return v


class BuilderUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    email: EmailStr | None = None
    phone: str | None = Field(
        None, min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$"
    )
    company_name: str | None = Field(None, min_length=1, max_length=200)
    website: str | None = Field(None, max_length=500)
    description: str | None = Field(None, min_length=10, max_length=2000)


class Builder(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    name: str
    email: EmailStr
    phone: str
    company_name: str
    website: str | None = None
    description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

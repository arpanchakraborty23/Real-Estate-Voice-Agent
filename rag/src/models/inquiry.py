from datetime import datetime, timezone
from uuid import UUID, uuid4

from pydantic import BaseModel, EmailStr, Field


class InquiryCreate(BaseModel):
    property_id: UUID | None = None
    name: str = Field(..., min_length=1, max_length=200)
    phone: str = Field(..., min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$")
    email: EmailStr | None = None
    message: str = Field(..., min_length=1, max_length=2000)


class Inquiry(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    property_id: UUID | None = None
    name: str
    phone: str
    email: str | None = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

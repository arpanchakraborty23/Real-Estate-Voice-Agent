from fastapi import APIRouter

from src.models.inquiry import Inquiry, InquiryCreate
from src.services import property_store

router = APIRouter(prefix="/inquiries", tags=["Inquiries"])


@router.post("", response_model=Inquiry, status_code=201)
async def create_inquiry(body: InquiryCreate):
    inquiry = Inquiry(**body.model_dump())
    return property_store.add_inquiry(inquiry)


@router.get("", response_model=list[Inquiry])
async def list_inquiries():
    return property_store.list_inquiries()

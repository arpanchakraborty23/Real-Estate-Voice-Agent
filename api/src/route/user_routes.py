import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.config import APIConstants
from src.config.models import User
from src.services.database import get_db
from src.services.clerk_service import get_or_create_user

logger = logging.getLogger(__name__)

user_router = APIRouter(prefix="/user")

clerk_config = ClerkConfig(
    jwks_url=APIConstants.api_config.CLERK_JWKS_URL,
    leeway=5.0,
    verify_iat=False,
)
clerk_guard = ClerkHTTPBearer(config=clerk_config, debug_mode=True)


@user_router.get("/me")
async def get_current_user_profile(
    credentials: HTTPAuthorizationCredentials = Depends(clerk_guard),
    db: AsyncSession = Depends(get_db),
):
    clerk_user_id = credentials.decoded["sub"]

    result = await db.execute(select(User).where(User.clerk_user_id == clerk_user_id))
    user = result.scalar_one_or_none()

    if not user:
        user = await get_or_create_user(clerk_user_id, db)

    if not user:
        raise HTTPException(status_code=404, detail="User not found — set CLERK_SECRET_KEY in .env")

    return {
        "id": str(user.id),
        "clerk_user_id": user.clerk_user_id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "phone": user.phone,
        "role": user.role,
        "profile_image": user.profile_image,
        "created_at": user.created_at.isoformat(),
    }

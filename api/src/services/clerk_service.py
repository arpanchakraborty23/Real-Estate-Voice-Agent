import logging

import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from src.config import APIConstants
from src.config.models import User

logger = logging.getLogger(__name__)
CLERK_API_BASE = "https://api.clerk.com/v1"


async def fetch_clerk_user(clerk_user_id: str) -> dict | None:
    secret_key = APIConstants.api_config.CLERK_SECRET_KEY
    if not secret_key:
        logger.warning("CLERK_SECRET_KEY not set — cannot fetch Clerk user data")
        return None
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{CLERK_API_BASE}/users/{clerk_user_id}",
            headers={"Authorization": f"Bearer {secret_key}"},
        )
        if resp.status_code == 200:
            return resp.json()
        logger.error("Clerk API error [%d]: %s", resp.status_code, resp.text)
        return None


async def get_or_create_user(clerk_user_id: str, db: AsyncSession) -> User | None:
    result = await db.execute(select(User).where(User.clerk_user_id == clerk_user_id))
    user = result.scalar_one_or_none()
    if user:
        return user

    clerk_data = await fetch_clerk_user(clerk_user_id)
    if not clerk_data:
        return None

    email = clerk_data.get("email_addresses", [{}])[0].get("email_address", "")
    first_name = clerk_data.get("first_name") or ""
    last_name = clerk_data.get("last_name") or ""

    user = User(
        clerk_user_id=clerk_user_id,
        email=email,
        first_name=first_name,
        last_name=last_name,
    )
    db.add(user)
    await db.flush()
    await db.refresh(user)
    return user

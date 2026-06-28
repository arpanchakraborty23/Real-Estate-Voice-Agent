import logging
import time
from livekit import api
from google.protobuf.json_format import ParseDict
from livekit.protocol.room import RoomConfiguration
from fastapi import APIRouter, Depends, HTTPException
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import APIConstants, TokenRequest, TokenRequestOutput
from src.services.database import get_db
from src.services.clerk_service import get_or_create_user

agent_router = APIRouter(prefix="/agent")
logger = logging.getLogger(__name__)

clerk_config = ClerkConfig(
    jwks_url=APIConstants.api_config.CLERK_JWKS_URL,
    leeway=5.0,
    verify_iat=False,
)
clerk_guard = ClerkHTTPBearer(config=clerk_config, debug_mode=True)


@agent_router.post("/token", status_code=201)
async def get_token(
    request: TokenRequest,
    credentials: HTTPAuthorizationCredentials = Depends(clerk_guard),
    db: AsyncSession = Depends(get_db),
) -> TokenRequestOutput:
    try:
        clerk_user_id = credentials.decoded["sub"]

        user = await get_or_create_user(clerk_user_id, db)

        if user:
            participant_name = f"{user.first_name} {user.last_name}".strip() or "User"
            metadata = request.participant_metadata or f'{{"email":"{user.email}","clerk_id":"{clerk_user_id}"}}'
            logger.info("Token for clerk_id=%s name=%s email=%s", clerk_user_id, participant_name, user.email)
        else:
            participant_name = request.participant_name or "User"
            metadata = request.participant_metadata or ""
            logger.info("Token for clerk_id=%s name=%s (fallback, no CLERK_SECRET_KEY)", clerk_user_id, participant_name)

        participant_identity = request.participant_identity or clerk_user_id

        api_key = APIConstants.livekit_config.LIVEKIT_API_KEY
        api_secret = APIConstants.livekit_config.LIVEKIT_API_SECRET
        server_url = APIConstants.livekit_config.LIVEKIT_URL

        if not all([api_key, api_secret, server_url]):
            raise HTTPException(status_code=500, detail="Server configuration error")

        room_name = request.room_name or f"room-{int(time.time())}"

        token = api.AccessToken(api_key, api_secret) \
            .with_identity(participant_identity) \
            .with_name(participant_name) \
            .with_metadata(metadata) \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
            ))

        if request.participant_attributes:
            token = token.with_attributes(request.participant_attributes)
        if request.room_config:
            room_config = ParseDict(
                request.room_config,
                RoomConfiguration(),
                ignore_unknown_fields=True,
            )
            token = token.with_room_config(room_config)

        participant_token = token.to_jwt()

        return TokenRequestOutput(
            server_url=server_url,
            room_name=room_name,
            participant_identity=participant_identity,
            participant_token=participant_token,
        )
    except Exception as e:
        logger.error("Token generation error: %s", e)
        raise HTTPException(status_code=500, detail="Failed to generate token")


@agent_router.post("/token_test", status_code=201)
async def get_test_token(request: TokenRequest) -> TokenRequestOutput:
    try:
        api_key = APIConstants.livekit_config.LIVEKIT_API_KEY
        api_secret = APIConstants.livekit_config.LIVEKIT_API_SECRET
        server_url = APIConstants.livekit_config.LIVEKIT_URL

        if not all([api_key, api_secret, server_url]):
            raise HTTPException(status_code=500, detail="Server configuration error")

        room_name = request.room_name or f"room-{int(time.time())}"
        participant_identity = request.participant_identity or f"user-{int(time.time())}"
        participant_name = request.participant_name or "User"

        token = api.AccessToken(api_key, api_secret) \
            .with_identity(participant_identity) \
            .with_name(participant_name) \
            .with_grants(api.VideoGrants(
                room_join=True,
                room=room_name,
                can_publish=True,
                can_subscribe=True,
            ))

        if request.participant_metadata:
            token = token.with_metadata(request.participant_metadata)
        if request.participant_attributes:
            token = token.with_attributes(request.participant_attributes)
        if request.room_config:
            room_config = ParseDict(
                request.room_config,
                RoomConfiguration(),
                ignore_unknown_fields=True,
            )
            token = token.with_room_config(room_config)

        participant_token = token.to_jwt()

        return TokenRequestOutput(
            server_url=server_url,
            room_name=room_name,
            participant_identity=participant_identity,
            participant_token=participant_token,
        )
    except Exception as e:
        logger.error("Token generation error: %s", e)
        raise HTTPException(status_code=500, detail="Failed to generate token")

import logging
import time
from livekit import api
from fastapi import APIRouter, Depends, HTTPException
from fastapi_clerk_auth import ClerkConfig, ClerkHTTPBearer, HTTPAuthorizationCredentials


from src.config import APIConstants, TokenRequest, TokenRequestOutput

# Configuration setup
agent_router = APIRouter(prefix="/agent")
logger = logging.getLogger(__name__)

clerk_config = ClerkConfig(jwks_url=APIConstants.api_config.CLERK_JWKS_URL)
clerk_gurd = ClerkHTTPBearer(config=clerk_config)

@agent_router.post("/token",status_code=201)
async def get_token(request: TokenRequest, credentials: HTTPAuthorizationCredentials = Depends(clerk_gurd))->TokenRequestOutput:
    try:
        user_id = credentials.decoded['sub']

        logger.info(f"User Information: /n{user_id}")

        api_key = APIConstants.livekit_config.LIVEKIT_API_KEY
        api_secret = APIConstants.livekit_config.LIVEKIT_API_SECRET
        server_url = APIConstants.livekit_config.LIVEKIT_URL

        if not all([api_key, api_secret, server_url]):
                raise HTTPException(
                    status_code=500,
                    detail='Server configuration error'
                )
        room_name = request.room_name or f'room-{int(time.time())}'
        participant_identity = request.participant_identity or f'user-{int(time.time())}'
        participant_name = request.participant_name or 'User'
        
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
            token = token.with_room_config(request.room_config)
        
        participant_token = token.to_jwt()
        
        return TokenRequestOutput(
             server_url=server_url,
             room_name=room_name,
             participant_identity=participant_identity,
             participant_token=participant_token
        )
    except Exception as e:
        print(f'Token generation error: {e}')
        raise HTTPException(
            status_code=500,
            detail='Failed to generate token'
        )


@agent_router.post("/token_test",status_code=201)
async def get_test_token(request: TokenRequest)->TokenRequestOutput:
    try:

        api_key = APIConstants.livekit_config.LIVEKIT_API_KEY
        api_secret = APIConstants.livekit_config.LIVEKIT_API_SECRET
        server_url = APIConstants.livekit_config.LIVEKIT_URL

        if not all([api_key, api_secret, server_url]):
                raise HTTPException(
                    status_code=500,
                    detail='Server configuration error'
                )
        room_name = request.room_name or f'room-{int(time.time())}'
        participant_identity = request.participant_identity or f'user-{int(time.time())}'
        participant_name = request.participant_name or 'User'
        
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
        
        participant_token = token.to_jwt()
        
        return TokenRequestOutput(
             server_url=server_url,
             room_name=room_name,
             participant_identity=participant_identity,
             participant_token=participant_token
        )
    except Exception as e:
        print(f'Token generation error: {e}')
        raise HTTPException(
            status_code=500,
            detail='Failed to generate token'
        )
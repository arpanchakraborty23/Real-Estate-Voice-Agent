from fastapi import APIRouter
from .agent_jwt import agent_router

app_router = APIRouter()

VERSION = "v1"

app_router.include_router(agent_router,prefix=f"/api/{VERSION}",tags=['Agent'])
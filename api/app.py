import asyncio
import sys
import logging
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .src.services import init_db,close_db


# setup logger
logging.basicConfig(
        level=logging.INFO,
    format= "%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger("Real-Estate-API")

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        logging.info("Starting Real Estate Backend API ...")
        # Database Initlization
        asyncio.run(init_db())
        yield
    except Exception as e:
        logger.error(f"System Error in Startup",e)
        asyncio.run(close_db())

    
app = FastAPI(
    title="Real-Estate-API",
    version="0.0.1",
    debug=True,
    lifespan=lifespan
)

# Adding Cros Origin MeddileWare
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    return {"message": "Real Estate Voice Agent API is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
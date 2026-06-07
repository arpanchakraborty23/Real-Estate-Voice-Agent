import uvicorn
from fastapi import FastAPI

from src.config import settings
from src.routes.builders import router as builders_router
from src.routes.inquiries import router as inquiries_router
from src.routes.properties import router as properties_router
from src.routes.search import router as search_router

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(properties_router, prefix=settings.api_prefix)
app.include_router(builders_router, prefix=settings.api_prefix)
app.include_router(inquiries_router, prefix=settings.api_prefix)
app.include_router(search_router, prefix=settings.api_prefix)


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run("src.main:app", host=settings.host, port=settings.port, reload=True)

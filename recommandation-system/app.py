import uvicorn
from fastapi import FastAPI

from src.database import engine
from src.models import Base
from src.routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.include_router(router)

@app.get("/")
async def health():
    return {"message": "Real Estate Voice Agent API is running!"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
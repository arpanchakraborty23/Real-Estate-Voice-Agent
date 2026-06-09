from fastapi import FastAPI

from src.database import SessionLocal
app = FastAPI()

@app.lifespan
async def lifespan(app: FastAPI):
    # Perform any necessary setup or initialization here
    print("Starting up the application...")
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    # Perform any necessary cleanup or shutdown tasks here
    print("Shutting down the application...")
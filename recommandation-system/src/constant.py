import os
from dotenv import load_dotenv
from dataclasses import dataclass

load_dotenv()

class Config:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

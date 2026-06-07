"""Dummy JSON file-based store for user data."""

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

logger = logging.getLogger("dummy_store")

DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"


class DummyStore:
    def __init__(self, file_name: str = "users.json") -> None:
        os.makedirs(DATA_DIR, exist_ok=True)
        self._path = DATA_DIR / file_name
        self._lock: set[str] = set()

    def _load(self) -> list[dict]:
        if not self._path.exists():
            return []
        with open(self._path, encoding="utf-8") as f:
            return json.load(f)

    def _save(self, records: list[dict]) -> None:
        with open(self._path, "w", encoding="utf-8") as f:
            json.dump(records, f, indent=2, default=str)

    async def save_user(self, user_data: dict) -> str:
        record = {
            "id": str(uuid4()),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **user_data,
        }
        records = self._load()
        records.append(record)
        self._save(records)
        logger.info(f"Saved user {record['id']}: {user_data.get('name', 'unknown')}")
        return record["id"]

    async def get_user(self, user_id: str) -> dict | None:
        for r in self._load():
            if r["id"] == user_id:
                return r
        return None

    async def list_users(self) -> list[dict]:
        return self._load()


dummy_store = DummyStore()

"""Seed the RAG API with dummy data from dummy_data.txt.

Usage:
    uv run python scripts/seed_from_txt.py

Requires the RAG API to be running on the configured host:port.
"""

import asyncio
import os
import sys
from pathlib import Path

import httpx

API_BASE = os.getenv("API_BASE", "http://127.0.0.1:8000/api")
DATA_FILE = Path(__file__).resolve().parent.parent / "dummy_data.txt"


def parse_properties(path: Path) -> list[dict]:
    """Parse the flat txt file into a list of property dicts."""
    properties: list[dict] = []
    current: dict[str, str] = {}

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            if current:
                properties.append(current)
                current = {}
            continue

        if ":" in line:
            key, _, value = line.partition(":")
            key = key.strip()
            value = value.strip()
            if value:
                current[key] = value

    if current:
        properties.append(current)

    return properties


def normalize(prop: dict) -> dict:
    """Convert flat dict into the PropertyCreate JSON format."""
    amenities_raw = prop.get("amenities", "")
    images_raw = prop.get("images", "")
    return {
        "name": prop["name"],
        "builder_id": prop["builder_id"],
        "builder_name": prop["builder_name"],
        "type": prop["type"],
        "location": prop["location"],
        "city": prop["city"],
        "state": prop["state"],
        "price": prop["price"],
        "size_sqft": float(prop["size_sqft"]),
        "bedrooms": int(prop["bedrooms"]),
        "bathrooms": int(prop.get("bathrooms", 0)),
        "amenities": [a.strip() for a in amenities_raw.split(",") if a.strip()],
        "description": prop["description"],
        "status": prop.get("status", "ready_to_move"),
        "images": [u.strip() for u in images_raw.split(",") if u.strip()],
    }


async def seed() -> None:
    properties = parse_properties(DATA_FILE)
    print(f"Found {len(properties)} properties in {DATA_FILE.name}")

    async with httpx.AsyncClient(timeout=30) as client:
        for i, prop in enumerate(properties, 1):
            body = normalize(prop)
            resp = await client.post(f"{API_BASE}/properties", json=body)
            if resp.status_code == 201:
                print(f"  [{i}/{len(properties)}] OK - {body['name']}")
            else:
                print(
                    f"  [{i}/{len(properties)}] FAIL ({resp.status_code}) - "
                    f"{body['name']}: {resp.text}"
                )

    print("\nDone. You can now query via POST /api/search")


def main() -> None:
    asyncio.run(seed())


if __name__ == "__main__":
    main()

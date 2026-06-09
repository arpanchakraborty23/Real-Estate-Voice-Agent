# Real Estate Recommendation System

FastAPI-based property recommendation engine with CRUD operations.

## Setup

```bash
pip install -r requirements.txt
```

Set `DATABASE_URL` in `.env` (defaults to SQLite if empty).

## Seed Database

```bash
python -m recommandation-system.src.seed
```

Loads `data/client_data.csv` into `builders` and `properties` tables.

## Run

```bash
uvicorn recommandation-system.app:app --reload
```

API docs at `http://localhost:8000/docs`.

## Endpoints

### Builders

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/builders` | List all builders |
| GET | `/api/builders/{id}` | Get builder |
| POST | `/api/builders` | Create builder |
| DELETE | `/api/builders/{id}` | Delete builder |

### Properties

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/properties` | List with filters |
| GET | `/api/properties/{id}` | Get property |
| POST | `/api/properties` | Create property |
| PUT | `/api/properties/{id}` | Update property |
| DELETE | `/api/properties/{id}` | Delete property |

### Recommendation

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/recommend` | Get top-K ranked property suggestions |

**Recommendation filters:** `budget_min`, `budget_max`, `bedrooms`, `location`, `property_type`, `amenities`, `status`.

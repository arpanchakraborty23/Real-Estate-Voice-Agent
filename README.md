# Real Estate Voice Agent

An AI-powered voice agent for real estate property discovery. Users visit the website, ask about properties via voice, and the agent searches a knowledge base to provide instant responses. Builders submit their property data through a RAG API, eliminating the need for manual promoter work.

## Project Structure

```
Real-Estate-Voice-Agent/
├── voice-Agent/          # LiveKit voice AI agent
│   ├── main.py           # Agent server entry point
│   ├── src/
│   │   ├── agent/        # Supervisor agent
│   │   ├── tools/        # Function tools (search, compare, contact)
│   │   ├── tasks/        # Multi-turn tasks (builder contact)
│   │   ├── prompt/       # System prompt
│   │   ├── constants/    # Configuration
│   │   └── utils/        # Vector store client
│   └── tests/
│
├── rag/                  # RAG API for property data
│   ├── src/
│   │   ├── main.py       # FastAPI entry point
│   │   ├── models/       # Pydantic models with validation
│   │   ├── routes/       # REST endpoints
│   │   └── services/     # Vector store + embedding
│   ├── scripts/          # Data seeding utilities
│   └── tests/
│
└── README.md
```

## How It Works

1. **Builders** submit property data via the RAG API (`POST /api/properties`)
2. Properties are embedded and stored in the vector database
3. **Users** visit the website and speak their property requirements
4. The **voice agent** processes speech → queries the vector store → responds verbally
5. Users can search, compare, and request builder contact — all by voice

## Quick Start

### Prerequisites

- Python 3.11+
- LiveKit Cloud account
- API keys: OpenAI, Deepgram, Cartesia

### 1. Start the RAG API

```bash
cd rag
uv sync
uv run uvicorn src.main:app --reload
```

Seed with 25 dummy properties across 9 cities:

```bash
uv run python scripts/seed_from_txt.py
```

### 2. Configure the Voice Agent

```bash
cd voice-Agent
cp .env.example .env.local
```

Add your `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` to `.env.local`.

### 3. Run the Voice Agent

```bash
cd voice-Agent
uv run python main.py dev
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/properties` | Add a property |
| GET | `/api/properties` | List/filter properties |
| GET | `/api/properties/{id}` | Get property details |
| PUT | `/api/properties/{id}` | Update property |
| DELETE | `/api/properties/{id}` | Delete property |
| POST | `/api/builders` | Register a builder |
| GET | `/api/builders` | List builders |
| POST | `/api/inquiries` | Submit a contact inquiry |
| POST | `/api/search` | Semantic property search |

## Testing

```bash
cd voice-Agent && uv run pytest
cd rag && uv run pytest
```

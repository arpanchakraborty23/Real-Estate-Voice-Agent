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

## Frontend Integration (RPC)

The voice agent can send data directly to the frontend UI via LiveKit RPC (remote procedure calls). This enables displaying property recommendations, search results, or other structured data on screen alongside the voice conversation.

### How it works

1. The LLM calls the `send_to_frontend` tool on the backend agent
2. The agent calls `room.local_participant.perform_rpc()` targeting the frontend participant
3. The frontend receives the data in its registered RPC method handler and updates the UI

### RPC Methods

| Method | Direction | Payload | Description |
|--------|-----------|---------|-------------|
| `showPropertyRecommendations` | Agent → Frontend | JSON array of property objects | Display property recommendations on the frontend |

### Frontend Implementation

The frontend must register an RPC method handler before joining the LiveKit room:

```typescript
import { RpcInvocationData } from 'livekit-client';

localParticipant.registerRpcMethod(
  'showPropertyRecommendations',
  async (data: RpcInvocationData) => {
    const recommendations = JSON.parse(data.payload);
    // Update your UI with the recommendations
    return JSON.stringify({ success: true });
  }
);
```

The payload for `showPropertyRecommendations` is a JSON array where each object has:
```json
{
  "location": "Andheri West, Mumbai",
  "price": "₹1.5 Crore",
  "bedrooms": 2,
  "bathrooms": 2,
  "area_sqft": 1200,
  "property_type": "Apartment",
  "builder_name": "ABC Builders",
  "contact_info": "+91-9876543210"
}
```

### Backend Implementation

See `voice-Agent/src/tasks/task_agent.py` — the `send_to_frontend` tool on `PropertySearchTask`.

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

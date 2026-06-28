# API Route Architecture Docs

This folder explains every endpoint in the API — what it does, how it works
step by step, and what can go wrong.

---

## Routes

| Read this | Covers | What you'll learn |
|-----------|--------|-------------------|
| [readme-app.md](./readme-app.md) | `app.py` — server entry point | How the server starts, connects to the database, and handles the health check |
| [readme-agent-jwt.md](./readme-agent-jwt.md) | `agent_jwt.py` | How the frontend gets a LiveKit token to talk to the voice agent — includes the Clerk JWT verification flow, the privacy-first vs fallback modes, and the test endpoint |
| [readme-user-routes.md](./readme-user-routes.md) | `user_routes.py` | How the frontend fetches the logged-in user's profile — includes the auto-creation flow when a user first visits |

---

## Quick reference

| Method | Path | Auth | What it does |
|--------|------|------|-------------|
| GET | `/` | None | Health check |
| POST | `/api/v1/agent/token` | Clerk JWT | Get a LiveKit token to join a voice call |
| POST | `/api/v1/agent/token_test` | None | Get a LiveKit token (no auth, for testing) |
| GET | `/api/v1/user/me` | Clerk JWT | Get the current user's profile |

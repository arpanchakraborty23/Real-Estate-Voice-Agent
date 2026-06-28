# Agent Token Route — `agent_jwt.py`

This file creates LiveKit tokens so the frontend can connect to a voice agent.
There are two endpoints — one for production (with Clerk auth) and one for
testing (no auth).

---

## `POST /api/v1/agent/token` — Get a LiveKit token (authenticated)

### What the frontend does

1. The user clicks "Start Consultation" on the website.
2. The frontend calls `useAuth().getToken()` to get the user's Clerk session JWT
   (this is a short-lived token proving who they are).
3. It sends a `POST` request to this endpoint with:
   - `Authorization: Bearer <clerk_jwt>` in the header
   - `room_name` and `room_config` in the body

### What the backend does — step by step

1. **Verify the Clerk JWT** — The `ClerkHTTPBearer` dependency grabs the
   `Authorization` header, downloads Clerk's public keys from the JWKS URL,
   and cryptographically verifies the token signature. If the token is fake or
   expired, it returns **401 Unauthorized**.

2. **Extract the user ID** — From the verified JWT, it reads the `sub` claim,
   which is the Clerk user ID (e.g., `user_3Fm8qjIb27PkKutd7HfAWzfYEXx`).

3. **Find or create the user** — It calls `get_or_create_user()`:
   - First checks the local `users` table for this `clerk_user_id`
   - If found, returns the stored user (with name, email, etc.)
   - If not found and **CLERK_SECRET_KEY** is set in `.env`, it calls Clerk's
     API (`GET /v1/users/{id}`) to fetch the user's name/email, stores them
     in the local database, and returns the new record
   - If **CLERK_SECRET_KEY** is not set, it returns `None` and the endpoint
     falls back to whatever `participant_name` the frontend sent in the body

4. **Build the LiveKit token** — An `AccessToken` is created:
   - Identity set to the Clerk user ID
   - Name set to the user's real name (from DB or fallback)
   - Metadata includes email and Clerk ID as JSON
   - Grants allow joining a room, publishing audio, and subscribing

5. **Handle room config** — If the frontend sent a `room_config` (like which
   agent to dispatch), it's converted from JSON to a protobuf
   `RoomConfiguration` object and attached to the token.

6. **Return the token** — The JWT string, server URL, and room name are sent
   back to the frontend. The frontend uses these to connect to LiveKit Cloud.

### Response example

```json
{
  "server_url": "wss://calling-agent-xxxx.livekit.cloud",
  "room_name": "room-1234567890",
  "participant_identity": "user_3Fm8qjIb27PkKutd7HfAWzfYEXx",
  "participant_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### What can go wrong

- **401** — Clerk JWT is expired, invalid, or missing
- **500** — `LIVEKIT_URL`, `LIVEKIT_API_KEY`, or `LIVEKIT_API_SECRET` are not
  set in `.env` (server misconfiguration)

---

## `POST /api/v1/agent/token_test` — Get a LiveKit token (no auth)

### What it's for

Local development and testing. This endpoint does **not** check any Clerk JWT.
Anyone who can reach the API can generate a token.

### What the backend does

1. Checks that LiveKit credentials exist (same as above).
2. Generates a token with the name and metadata the frontend provides, or falls
   back to defaults like `"User"` and `"user-{timestamp}"`.
3. Returns the token.

### When to use this

- You're testing locally without Clerk set up
- You want to quickly verify the voice agent works end-to-end
- You don't care about auth for now

---

## Two modes for user data (important!)

| Mode | When it activates | Where name/email come from |
|------|-------------------|---------------------------|
| **Privacy-first** | `CLERK_SECRET_KEY` is set in `.env` | Backend fetches from Clerk API, stores in DB, uses DB values |
| **Fallback** | `CLERK_SECRET_KEY` is empty | Backend uses whatever the frontend sends as `participant_name` |

In **fallback mode**, the frontend must send `participant_name` and
`participant_metadata` in the request body, otherwise the participant will
just be named `"User"` with empty metadata.

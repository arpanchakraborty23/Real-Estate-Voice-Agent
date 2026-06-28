# Application Entry Point — `app.py`

This is where the API server starts. When you run `uvicorn app:app`, this file
is the first thing that loads.

---

## What happens when the server starts

1. FastAPI creates the app and sets up CORS middleware (which tells the browser
   it's OK for the frontend at `localhost:5173` to talk to this API).
2. The `lifespan` function runs — it connects to the PostgreSQL database and
   creates the `users`, `builders`, `properties`, and `property_images` tables
   if they don't already exist.
3. All routes from `agent_jwt.py` and `user_routes.py` get registered under
   `/api/v1/...`.
4. The server starts listening for requests.

## What happens when the server shuts down

The database connection pool is closed so no connections leak.

---

## Endpoints defined here

### `GET /`

Just returns `{ "status": "healthy" }` — used by load balancers or monitoring
tools to check if the server is alive. No auth needed.

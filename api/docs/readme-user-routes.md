# User Profile Route — `user_routes.py`

This file handles reading user profiles. It only has one endpoint.

---

## `GET /api/v1/user/me` — Get your own profile

### What the frontend does

1. The user is signed in via Clerk.
2. The frontend calls `useAuth().getToken()` to get the Clerk session JWT.
3. It sends a `GET` request with `Authorization: Bearer <clerk_jwt>`.

### What the backend does — step by step

1. **Verify the Clerk JWT** — Same as the token endpoint: the JWT is
   cryptographically verified using Clerk's public keys. If invalid, **401**.

2. **Extract the user ID** — Reads the `sub` claim from the JWT (the Clerk
   user ID like `user_3Fm8qjIb27PkKutd7HfAWzfYEXx`).

3. **Look up the user in the local database** — Queries the `users` table
   where `clerk_user_id` matches.

4. **If the user is found** — Returns the profile immediately.

5. **If the user is NOT found** — Tries to fetch the user from Clerk's API:
   - Calls `GET https://api.clerk.com/v1/users/{user_id}` using the
     `CLERK_SECRET_KEY` for authentication
   - Clerk returns the user's email, first name, last name, phone, etc.
   - A new record is created in the local `users` table
   - The profile is returned

6. **If the user is NOT found AND CLERK_SECRET_KEY is not set** — Returns
   **404** with a message telling you to set `CLERK_SECRET_KEY` in `.env`.

### Response example

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "clerk_user_id": "user_3Fm8qjIb27PkKutd7HfAWzfYEXx",
  "email": "arpan@example.com",
  "first_name": "Arpan",
  "last_name": "Chakraborty",
  "phone": null,
  "role": "buyer",
  "profile_image": "https://img.clerk.com/...",
  "created_at": "2026-06-28T12:00:00"
}
```

### What can go wrong

- **401** — Clerk JWT is expired, invalid, or missing
- **404** — User doesn't exist yet AND `CLERK_SECRET_KEY` is not configured,
  so the backend can't fetch the data from Clerk

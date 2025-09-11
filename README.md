# Project


## Added by ChatGPT

- **Env-based JWT secret**: Set `JWT_SECRET` in `.env` (see `.env.example`).
- **Rate limiting**: Basic per-IP in-memory limiter for vehicle lookup routes.
- **Bulk lookup endpoint**: `POST /api/vehicles/bulk` with `{ "plates": ["ABC123", "XYZ789"] }` returns an array of results.

> Note: In-memory features are for demo only — use a persistent store in production (e.g., Redis for rate limits, Postgres for data).


## Security upgrades (added now)
- **RS256 tokens + JWKS**: Access tokens are RS256-signed (10 min). JWKS served at `/api/.well-known/jwks.json`.
- **Auth-required middleware**: Protects pages; APIs remain individually guarded.
- **Audit log**: Append-only, hash-chained at `data/audit.log` via `auditLog()`.
- **Data minimization**: `/api/vehicles/[plate]` returns `{ found, insured, status, policyEndDate, insurerName }` only.

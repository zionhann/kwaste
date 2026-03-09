# Architecture

## System Shape

The system is split into:

- a React/Vite frontend in `frontend/` for region selection, query input, and result rendering
- a FastAPI backend in `backend/` for location lookup, semantic ranking, and lightweight query logging

The backend is the only component that touches the model, embeddings, and source CSV.

## Component Responsibilities

### Frontend

- fetches `GET /api/locations` to populate `시도명` and `시군구명` selectors
- submits `GET /api/search` with the current query and optional region filters
- renders ranked results with fee, spec, and location context

### Backend API

- loads the model, CSV, and embeddings during FastAPI lifespan startup
- exposes read-only `GET` endpoints for health, location metadata, and search
- records lightweight query counts to `backend/logs/history.json`

### Retrieval Layer

- uses `jhgan/ko-sroberta-multitask`
- loads precomputed normalized embeddings from `backend/data/embeddings.npy`
- ranks candidate rows with vector dot product after region filtering

## Data Flow

1. `backend/scripts/generate_embeddings.py` reads `backend/waste_disposal_fee.csv`.
2. The script formats each row as `품목: {대형폐기물명} | 유의어: {대형폐기물특징}` and writes normalized vectors to `backend/data/embeddings.npy`.
3. On backend startup, `app/search.py` loads the model, CSV, and embeddings into memory and validates row-count and dimension compatibility.
4. At request time, the backend normalizes the incoming query to `품목: <query>`, filters by `시도명` and `시군구명` when provided, scores the remaining rows, and returns the top 10 matches.
5. The frontend displays those matches without additional client-side ranking.

## Runtime And Storage Boundaries

- Source data is a checked-in CSV, not a database.
- Search state is in-memory per backend process after startup.
- Query analytics are persisted as a local JSON file, not an external logging or analytics service.
- The frontend talks to the backend through HTTP only; there is no shared runtime or server-side rendering layer.
- CORS is currently permissive for `GET` requests so the frontend can call the backend from another origin during development.

## Tradeoffs

- Dense retrieval improves recall for colloquial Korean queries but increases cold-start cost, model size, and memory use.
- Precomputed embeddings keep request latency low but require manual regeneration when the data or prompt format changes.
- File-based data and logging are easy to ship in Docker but weak for concurrent writes, live updates, and historical analysis.
- Open CORS and no auth are acceptable for a public read-only POC, not for a hardened production boundary.

## Revisit Conditions

- Data size or latency makes full in-memory ranking too slow.
- Search quality needs better synonym handling, reranking, or more structured filtering.
- The product needs live municipal data updates, admin editing, or stronger auditability.
- The API becomes public enough that auth, rate limiting, or stricter CORS are required.

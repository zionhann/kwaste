# Workflows

## Common Tasks

### Run the backend locally

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/generate_embeddings.py
fastapi dev app/main.py
```

### Run the frontend locally

```bash
cd frontend
npm install
VITE_API_BASE=http://localhost:8000 npm run dev
```

There is no Vite proxy configured, so `VITE_API_BASE` is required when the frontend and backend run on different origins.

### Build artifacts

```bash
cd frontend
npm run build
```

```bash
docker build -t kwaste-backend backend
docker run --rm -p 8000:8000 kwaste-backend
```

### Smoke-check the API

```bash
curl http://localhost:8000/
curl 'http://localhost:8000/api/locations'
curl 'http://localhost:8000/api/search?query=티비'
```

## Guardrails

- Regenerate embeddings after any change to `backend/waste_disposal_fee.csv`, `backend/scripts/generate_embeddings.py`, the embedding model name, or the text template.
- Keep `frontend/src/types.ts` and `frontend/src/api.ts` aligned with backend response shapes.
- Backend startup intentionally raises if embeddings are missing, row counts differ, or the embedding dimension is not 768.
- Query analytics are persisted to `backend/logs/history.json`; that file is runtime state and is gitignored.
- CORS is currently open to `*` for `GET` requests only.

## Update Triggers

- Product scope or success criteria changes: update `docs/purpose.md`
- Search fields, API shapes, or ranking invariants change: update `docs/domain.md`
- Commands, environment variables, or operational checks change: update `docs/workflows.md`
- System shape, storage, or retrieval strategy changes: update `docs/architecture.md`

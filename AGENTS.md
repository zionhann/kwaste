# Repository Guidelines

## Project Structure & Module Organization

- `frontend/` + `backend/`: main implementation.

Frontend code lives in `*/frontend/src` (`App.tsx`, `api.ts`, `types.ts`), and static assets are in `*/frontend/public`. Backend API code lives in `*/backend/app` (`main.py`, `search.py`, `models.py`), with embedding/data scripts in `*/backend/scripts`.

## Build, Test, and Development Commands

Run commands from the target module directory.

- Frontend (`frontend`, `add-keyword/frontend`, `fasttext/frontend`):
  - `npm install`: install dependencies.
  - `npm run dev`: start Vite dev server.
  - `npm run build`: type-check and build production bundle.
  - `npm run lint`: run ESLint.
- Backend (`backend`, `add-keyword/backend`, `fasttext/backend`):
  - `python -m pip install -r requirements.txt`: install Python deps.
  - `python scripts/generate_embeddings.py`: regenerate embeddings from CSV input.
  - `fastapi run app/main.py --host 0.0.0.0 --port 8000`: run API locally.
  - `docker build -t waste-api .`: build container image.

## Coding Style & Naming Conventions

Follow existing style in each module:

- TypeScript/React: 2-space indentation, double quotes, functional components, `camelCase` for variables/functions, `PascalCase` for components and types.
- Python/FastAPI: PEP 8, 4-space indentation, type hints, `snake_case` for functions/variables, `PascalCase` for models.
- Keep feature-specific logic close to module boundaries (`api.ts`, `search.py`) and avoid cross-variant imports.

## Testing Guidelines

No dedicated first-party test suite is currently checked in. Minimum validation before PR:

- `npm run lint` and `npm run build` in the affected frontend module.
- API smoke checks for backend (for example, `GET /` and `GET /api/search?query=...`).
- If adding tests, place them under a top-level `tests/` folder within the affected module and name files `test_*.py` or `*.test.ts`.

## Commit & Pull Request Guidelines

Use Conventional Commits, consistent with history:

- Examples: `feat: implement semantic search`, `fix(search): resolve short-keyword ranking`, `refactor(logging): extract logging module`.
- Format: `type(scope): summary` (scope optional).

PRs should include:

- Linked issue/requirement (`PRD.md`, `SPEC.md`, or issue number).
- Validation evidence (lint/build output, API checks, and UI screenshots for frontend changes).

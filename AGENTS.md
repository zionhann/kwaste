# Repository Harness

This repository uses `docs/` as the canonical source for durable product and implementation context.

## Context Map

- `docs/purpose.md`: what the product does, who it serves, hard constraints, and non-goals
- `docs/domain.md`: Korean data vocabulary, API shapes, and search invariants
- `docs/workflows.md`: local commands, entry points, guardrails, and update triggers
- `docs/architecture.md`: system shape, data flow, runtime boundaries, and architecture tradeoffs

## Repository Rules

- Treat the files in `docs/` as canonical durable context.
- When code or data changes invalidate durable context, update the affected `docs/*.md` file first and then update this index if the file set changes.
# Purpose

## Goal

Provide a Korean semantic search experience for bulky waste fee data so users can find the official disposal item and fee even when they search with colloquial or approximate wording.

## User Job

The user selects a region (`시도명`, optionally `시군구명`), enters a short Korean item name such as `티비`, and expects the app to surface the closest official waste item entries and fees.

## Constraints

- The source of truth is `backend/waste_disposal_fee.csv`; the checked-in CSV currently has 22,842 rows.
- Queries are short Korean phrases, usually one or two words.
- Results are ranked semantically, not by exact keyword match.
- The product is read-only. It helps identify an item and fee, but does not handle scheduling, payment, or municipal submission.
- Backend startup depends on a compatible `backend/data/embeddings.npy` file generated from the same CSV and embedding model.

## Non-goals

- Editing or authoring waste fee data in the app
- Real-time synchronization with external municipal systems
- Authentication, accounts, or personalized history
- Multilingual search or long-form conversational search

## Success Criteria

- A colloquial query returns up to 10 plausible official items.
- Each result includes enough context to act on it: name, category, spec, fee, similarity, `시도명`, and `시군구명`.
- Region filters narrow the candidate set before ranking.
- The system fails fast on startup when the CSV and embeddings drift out of sync.

# Domain

## Terms

- `품목`: the official bulky waste item name returned to the user
- `유의어`: extra synonym-like text from `대형폐기물특징` used only during embedding generation
- `시도명` and `시군구명`: region filters that constrain the candidate set before ranking
- `수수료`: disposal fee; missing values are normalized to `0`
- `similarity`: the dot product of normalized vectors, equivalent to cosine similarity

## Source Data

The backend CSV carries these fields that matter to search behavior:

- `시도명`, `시군구명`
- `대형폐기물명`, `대형폐기물구분명`, `대형폐기물규격`
- `유무료여부`, `수수료`
- `대형폐기물특징`, `대형폐기물설명`

Other provider metadata exists in the CSV but is not exposed through the API.

## API Shapes

`GET /api/locations`

- Returns `{"sido": string[], "sigungu": Record<string, string[]>}`

`GET /api/search`

- Accepts `query` (required), `sido` (optional), and `sigungu` (optional)
- Returns `results[]` with `name`, `category`, `spec`, `fee`, `similarity`, `sido`, and `sigungu`

## Retrieval Invariants

- Runtime queries are normalized to `품목: <query>`.
- Embedding generation currently uses `품목: {대형폐기물명} | 유의어: {대형폐기물특징}`.
- Embeddings are stored normalized; ranking uses vector dot product.
- Region filtering happens before similarity ranking.
- Default result count is 10.
- Duplicate item names across regions or specs are expected and should not be deduplicated automatically.

## Data Invariants

- Rows missing `대형폐기물명` are dropped before embeddings and search.
- Missing `대형폐기물규격` becomes an empty string.
- Missing `수수료` becomes `0`.
- `backend/data/embeddings.npy` row count must equal the filtered CSV row count.
- Embedding dimension must remain 768 for the current model and startup checks.

## Edge Cases

- If a filter combination produces no candidates, the API returns an empty result list.
- `query` is capped at 200 characters; `sido` and `sigungu` are capped at 50 characters.
- The UI renders `무료` when `fee` is `0`.

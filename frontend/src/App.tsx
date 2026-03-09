import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { fetchLocations, searchItems } from "./api";
import type { LocationsResponse, SearchResult } from "./types";
import "./App.css";

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function App() {
  const [locations, setLocations] = useState<LocationsResponse | null>(null);
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const searchControllerRef = useRef<AbortController | null>(null);
  const sidoId = useId();
  const sigunguId = useId();
  const queryId = useId();
  const searchHintId = useId();

  useEffect(() => {
    const controller = new AbortController();

    fetchLocations(controller.signal)
      .then((response) => {
        setLocations(response);
        setLocationError("");
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) return;
        setLocationError("지역 정보를 불러오는데 실패했습니다.");
      });

    return () => controller.abort();
  }, []);

  useEffect(
    () => () => {
      searchControllerRef.current?.abort();
    },
    []
  );

  const handleSidoChange = (value: string) => {
    setSido(value);
    setSigungu("");
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setSearchError("검색어를 입력해주세요.");
      return;
    }

    searchControllerRef.current?.abort();
    const controller = new AbortController();
    searchControllerRef.current = controller;

    setLoading(true);
    setSearchError("");
    setHasSearched(true);

    try {
      const response = await searchItems(
        trimmedQuery,
        sido || undefined,
        sigungu || undefined,
        controller.signal
      );
      setResults(response.results);
    } catch (error: unknown) {
      if (isAbortError(error)) return;
      setResults([]);
      setSearchError("검색에 실패했습니다.");
    } finally {
      if (searchControllerRef.current === controller) {
        searchControllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const sigunguOptions = sido && locations ? locations.sigungu[sido] || [] : [];

  return (
    <div className="container">
      <h1>대형폐기물 품목 검색</h1>
      <p className="description">
        버리려는 물건을 검색하면 유사한 대형폐기물 품목과 수수료를 안내합니다.
      </p>

      <form onSubmit={handleSearch} className="search-form">
        <div className="filters">
          <div className="field-group">
            <label htmlFor={sidoId} className="field-label">
              시도
            </label>
            <select
              id={sidoId}
              value={sido}
              onChange={(e) => handleSidoChange(e.target.value)}
              className="select"
            >
              <option value="">시도 선택</option>
              {locations?.sido.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor={sigunguId} className="field-label">
              시군구
            </label>
            <select
              id={sigunguId}
              value={sigungu}
              onChange={(e) => setSigungu(e.target.value)}
              className="select"
              disabled={!sido}
            >
              <option value="">시군구 선택</option>
              {sigunguOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="search-row">
          <div className="field-group search-field">
            <label htmlFor={queryId} className="field-label">
              검색어
            </label>
            <input
              id={queryId}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="예: 티비, 소파, 냉장고"
              className="search-input"
              aria-describedby={searchHintId}
            />
            <p id={searchHintId} className="sr-only">
              버리려는 물건 이름을 한두 단어로 입력하세요.
            </p>
          </div>
          <button
            type="submit"
            className="search-button"
            aria-busy={loading}
          >
            {loading && <span className="loading-spinner" aria-hidden="true" />}
            {loading ? "검색 중..." : "검색"}
          </button>
        </div>
      </form>

      {locationError && (
        <div className="error" role="alert">
          {locationError}
        </div>
      )}

      {searchError && (
        <div className="error" role="alert">
          {searchError}
        </div>
      )}

      {hasSearched && results.length === 0 && !loading && !searchError && (
        <div className="results" aria-live="polite">
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>검색 결과가 없습니다.</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="results" aria-live="polite">
          <h2>검색 결과</h2>
          <ul className="result-list">
            {results.map((item, index) => (
              <li
                key={`${item.name}-${item.category}-${item.sigungu}-${item.sido}-${index}`}
                className="result-item"
              >
                <div className="result-header">
                  <span className="item-name">{item.name}</span>
                  <span className="similarity">
                    {(item.similarity * 100).toFixed(1)}% 일치
                  </span>
                </div>
                <div className="result-details">
                  <span className="category">{item.category}</span>
                  {item.spec && <span className="spec">{item.spec}</span>}
                </div>
                <div className="result-footer">
                  <span className="location">
                    {item.sido} {item.sigungu}
                  </span>
                  <span className="fee">
                    {item.fee > 0 ? `${item.fee.toLocaleString()}원` : "무료"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

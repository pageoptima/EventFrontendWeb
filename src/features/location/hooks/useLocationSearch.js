import { useState, useRef, useCallback, useEffect } from "react";
import { searchLocations } from "@/features/location/services/locationService";

const DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

export function useLocationSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);
  const abortRef = useRef(null);

  const search = useCallback((value) => {
    setQuery(value);
    setError(null);

    clearTimeout(timerRef.current);

    if (!value || value.trim().length < MIN_QUERY_LENGTH) {
      abortRef.current?.abort();
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    timerRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const data = await searchLocations(value, controller.signal);
        setResults(data);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError("Could not load results. Try again.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  const clear = useCallback(() => {
    clearTimeout(timerRef.current);
    abortRef.current?.abort();
    setQuery("");
    setResults([]);
    setIsSearching(false);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  return { query, search, results, isSearching, error, clear };
}

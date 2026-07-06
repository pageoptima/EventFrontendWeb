import { useState, useEffect, useRef } from "react";
import { searchUsers } from "@/features/search/services/searchService";

const DEBOUNCE_MS = 400;

function useSearch() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setUsers([]);
      setIsLoading(false);
      clearTimeout(timerRef.current);
      return;
    }

    setIsLoading(true);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        const { users: results, hasMore: more } = await searchUsers(trimmed);
        setUsers(results);
        setHasMore(more);
      } catch {
        setUsers([]);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timerRef.current);
  }, [query]);

  return { query, setQuery, users, isLoading, hasMore };
}

export default useSearch;

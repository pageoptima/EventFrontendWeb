import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/features/search/services/searchService";
import { searchKeys } from "@/features/search/queryKeys";
import { useDebounce } from "@/shared/hooks/useDebounce";

const DEBOUNCE_MS = 400;

function useSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query.trim(), DEBOUNCE_MS);

  const { data, isFetching } = useQuery({
    queryKey: searchKeys.users(debouncedQuery),
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 30,
  });

  // Show spinner while typing (pre-debounce) or while the request is in flight.
  const isLoading =
    query.trim().length > 0 &&
    (query.trim() !== debouncedQuery || isFetching);

  return {
    query,
    setQuery,
    users: data?.users ?? [],
    hasMore: data?.hasMore ?? false,
    isLoading,
  };
}

export default useSearch;

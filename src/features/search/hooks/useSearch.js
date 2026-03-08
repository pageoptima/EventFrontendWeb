import { useMemo, useState } from "react";

function useSearch(posts, events) {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return posts;

    return posts.filter((post) => {
      return (
        post.user?.name?.toLowerCase().includes(normalizedQuery) ||
        post.user?.handle?.toLowerCase().includes(normalizedQuery) ||
        post.id.toLowerCase().includes(normalizedQuery) ||
        post.description?.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [posts, query]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return events;

    return events.filter((event) => {
      return (
        event.name?.toLowerCase().includes(normalizedQuery) ||
        event.place?.toLowerCase().includes(normalizedQuery) ||
        event.id.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [events, query]);

  return {
    query,
    setQuery,
    filteredPosts,
    filteredEvents,
  };
}

export default useSearch;

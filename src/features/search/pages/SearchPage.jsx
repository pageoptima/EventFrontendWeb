import { events as eventsData } from "@/app/config/events";
import { feedPosts } from "@/app/config/posts";
import SearchBar from "@/features/search/components/SearchBar";
import SearchResults from "@/features/search/components/SearchResults";
import useSearch from "@/features/search/hooks/useSearch";

function SearchPage() {
  const { query, setQuery, filteredPosts, filteredEvents } = useSearch(
    feedPosts,
    eventsData,
  );

  return (
    <section className="space-y-6">
      <SearchBar query={query} onQueryChange={setQuery} />
      <SearchResults
        query={query}
        filteredPosts={filteredPosts}
        filteredEvents={filteredEvents}
      />
    </section>
  );
}

export default SearchPage;

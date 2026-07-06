import SearchBar from "@/features/search/components/SearchBar";
import SearchResults from "@/features/search/components/SearchResults";
import useSearch from "@/features/search/hooks/useSearch";

function SearchPage() {
  const { query, setQuery, users, isLoading } = useSearch();

  return (
    <section className="space-y-6">
      <SearchBar query={query} onQueryChange={setQuery} />
      <SearchResults query={query} users={users} isLoading={isLoading} />
    </section>
  );
}

export default SearchPage;

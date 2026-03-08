import { Sliders } from "lucide-react";
import searchAiIcon from "@/assets/icons/search-ai.svg";

function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative">
      <img
        src={searchAiIcon}
        alt="search"
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-80"
      />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by Event name, place, etc."
        className="w-full rounded-2xl border border-border bg-muted px-12 py-3 text-sm placeholder:text-muted-foreground"
      />
      <button
        type="button"
        aria-label="Filters"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-transparent p-1 text-muted-foreground hover:text-foreground"
      >
        <Sliders className="h-5 w-5" />
      </button>
    </div>
  );
}

export default SearchBar;

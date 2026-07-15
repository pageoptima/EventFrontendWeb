import { useRef, useEffect, useState } from "react";
import { MapPin, X, Loader2, Search } from "lucide-react";
import { useLocationSearch } from "@/features/location/hooks/useLocationSearch";
import { getLocationLabel } from "@/features/location/services/locationService";
import { cn } from "@/lib/utils";

/**
 * Returns the primary name and secondary address line from a Nominatim result.
 */
function splitDisplayName(result) {
  const parts = result.display_name.split(",");
  const primary = result.name || parts[0].trim();
  const secondary = parts.slice(1).join(",").trim();
  return { primary, secondary };
}

/**
 * Instagram/Facebook-style location search backed by Nominatim.
 *
 * Props:
 *   value         — selected Nominatim result object, or null
 *   onSelect(result) — called when the user picks a result
 *   onClear()        — called when the user removes the selection
 */
function LocationSearchInput({ value, onSelect, onClear }) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const { query, search, results, isSearching, error, clear } =
    useLocationSearch();

  // Close dropdown on outside click
  useEffect(() => {
    function handlePointerDown(e) {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function handleInput(e) {
    search(e.target.value);
    setOpen(true);
  }

  function handleSelect(result) {
    clear();
    setOpen(false);
    onSelect(result);
  }

  function handleClear() {
    clear();
    setOpen(false);
    onClear();
  }

  const showDropdown = open && (results.length > 0 || error);

  // ── Selected state ─────────────────────────────────────────────────────────
  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
        <MapPin className="h-4 w-4 shrink-0 text-[#B839F1] dark:text-[#7F5AF0]" />
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
          {getLocationLabel(value)}
        </span>
        <button
          type="button"
          onClick={handleClear}
          aria-label="Remove location"
          className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ── Search state ────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative">
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2.5 transition",
          "focus-within:ring-2 focus-within:ring-[#B839F1]/40 dark:focus-within:ring-[#7F5AF0]/40",
        )}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <input
          ref={inputRef}
          value={query}
          onChange={handleInput}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for a place…"
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          {error ? (
            <p className="px-3 py-2.5 text-xs text-destructive">{error}</p>
          ) : (
            <ul role="listbox" aria-label="Location results">
              {results.map((result) => {
                const { primary, secondary } = splitDisplayName(result);
                return (
                  <li key={result.place_id}>
                    <button
                      type="button"
                      role="option"
                      onClick={() => handleSelect(result)}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                    >
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {primary}
                        </span>
                        {secondary && (
                          <span className="block truncate text-xs text-muted-foreground">
                            {secondary}
                          </span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default LocationSearchInput;

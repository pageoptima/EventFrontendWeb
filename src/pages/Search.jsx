import { useMemo, useState } from "react";
import searchAiIcon from "@/assets/icons/search-ai.svg";
import { Sliders } from "lucide-react";
import { feedPosts } from "@/config/posts";
import { events as eventsData } from "@/config/events";

function Search() {
  const [query, setQuery] = useState("");

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return feedPosts;
    return feedPosts.filter((p) => {
      return (
        p.user?.name?.toLowerCase().includes(q) ||
        p.user?.handle?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventsData;
    return eventsData.filter((e) => {
      return (
        e.name?.toLowerCase().includes(q) ||
        e.place?.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    });
  }, [query]);

  return (
    <section className="space-y-6">
      <div>
        <div className="relative">
          <img
            src={searchAiIcon}
            alt="search"
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-80"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
      </div>

      <div>
        {query && (
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">
              Results for "{query}"
            </h2>
            <p className="text-sm text-muted-foreground">
              {filteredPosts.length} posts • {filteredEvents.length} events
            </p>
          </div>
        )}

        {query && filteredEvents.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-semibold">Events</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 mb-4">
              {filteredEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="relative overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={ev.image}
                    alt={ev.name}
                    loading="lazy"
                    className="h-36 w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 px-3 py-2 text-sm text-white">
                    <div className="font-semibold">{ev.name}</div>
                    <div className="text-xs text-white/80">{ev.place}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {filteredPosts.map((post) => (
            <div key={post.id} className="overflow-hidden rounded-lg bg-muted">
              <img
                src={post.image}
                alt={`${post.user.name} post`}
                loading="lazy"
                className="h-40 w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Search;

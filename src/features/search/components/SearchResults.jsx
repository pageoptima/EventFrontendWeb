function SearchResults({ query, filteredPosts, filteredEvents }) {
  return (
    <div>
      {query ? (
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Results for "{query}"</h2>
          <p className="text-sm text-muted-foreground">
            {filteredPosts.length} posts • {filteredEvents.length} events
          </p>
        </div>
      ) : null}

      {query && filteredEvents.length > 0 ? (
        <div className="mb-4">
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="relative overflow-hidden rounded-lg bg-muted"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  loading="lazy"
                  className="h-36 w-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 px-3 py-2 text-sm text-white">
                  <div className="font-semibold">{event.name}</div>
                  <div className="text-xs text-white/80">{event.place}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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
  );
}

export default SearchResults;

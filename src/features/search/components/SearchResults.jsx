import { useNavigate } from "react-router-dom";

function UserAvatar({ name, profilePicture }) {
  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name}
        className="h-10 w-10 shrink-0 rounded-full object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5">
          <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function SearchResults({ query, users, isLoading }) {
  const navigate = useNavigate();

  if (!query.trim()) return null;

  if (isLoading) return <SearchResultsSkeleton />;

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No users found for &ldquo;{query}&rdquo;.
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        {users.length} result{users.length !== 1 ? "s" : ""}
      </p>
      <div className="space-y-1">
        {users.map((user) => (
          <button
            key={user.id}
            type="button"
            onClick={() => navigate(`/profile/${user.id}`)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-muted"
          >
            <UserAvatar name={user.name} profilePicture={user.profilePicture} />
            <span className="text-sm font-medium text-foreground">
              {user.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;

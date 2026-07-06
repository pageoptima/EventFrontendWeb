import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Search, Loader2 } from "lucide-react";
import { useMyFriends, useUserFriends } from "@/features/friend/hooks/useFriendQueries";

function FriendItem({ friend, onClose }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => { navigate(`/profile/${friend.id}`); onClose(); }}
      className="flex w-full items-center gap-3 px-4 py-2.5 transition hover:bg-white/5"
    >
      {friend.profilePicture ? (
        <img
          src={friend.profilePicture}
          alt={friend.name}
          className="h-11 w-11 shrink-0 rounded-full object-cover ring-2 ring-white/10"
          loading="lazy"
        />
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-base font-bold text-white">
          {friend.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className="min-w-0 flex-1 text-left">
        <p className="truncate text-sm font-semibold text-white">{friend.name}</p>
        {friend.isMutual && (
          <p className="text-xs text-white/50">Mutual friend</p>
        )}
      </div>
    </button>
  );
}

function FriendsModal({ isOwn, profileUserId, onClose }) {
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

  // Only one of these fires depending on isOwn — the other has enabled:false
  const { data: myFriends = [], isLoading: myLoading } = useMyFriends({ enabled: isOwn });
  const { data: userFriends = [], isLoading: userLoading } = useUserFriends(
    profileUserId,
    { enabled: !isOwn && Boolean(profileUserId) },
  );

  const friends = isOwn ? myFriends : userFriends;
  const isLoading = isOwn ? myLoading : userLoading;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const filtered = friends.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-[#262626] shadow-2xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-white/10 py-3">
          <h2 className="text-sm font-semibold text-white">Friends</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-white/50" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-white/40">
              {search ? "No results." : "No friends yet."}
            </p>
          ) : (
            <div className="pb-2">
              {filtered.map((friend) => (
                <FriendItem key={friend.id} friend={friend} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsModal;

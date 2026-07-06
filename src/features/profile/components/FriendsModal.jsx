import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Search, Loader2 } from "lucide-react";
import { useMyFriends, useUserFriends } from "@/features/friend/hooks/useFriendQueries";
import { friendKeys } from "@/features/friend/queryKeys";
import { profileKeys } from "@/features/profile/queryKeys";
import { removeFriend } from "@/features/friend/services/friendService";

function FriendItem({ friend, isOwn, onClose }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const unfriend = useMutation({
    mutationFn: () => removeFriend(friend.id),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: friendKeys.myFriends() }),
        queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
      ]),
  });

  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <button
        type="button"
        onClick={() => { navigate(`/profile/${friend.id}`); onClose(); }}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        {friend.profilePicture ? (
          <img
            src={friend.profilePicture}
            alt={friend.name}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-base font-bold text-white">
            {friend.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{friend.name}</p>
          {friend.isMutual && (
            <p className="text-xs text-muted-foreground">Mutual friend</p>
          )}
        </div>
      </button>

      {isOwn && (
        <button
          type="button"
          onClick={() => unfriend.mutate()}
          disabled={unfriend.isPending}
          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
        >
          {unfriend.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Unfriend"}
        </button>
      )}
    </div>
  );
}

function FriendsModal({ isOwn, profileUserId, onClose }) {
  const [search, setSearch] = useState("");
  const inputRef = useRef(null);

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
        className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-white shadow-2xl max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex shrink-0 items-center justify-center border-b border-border py-3">
          <h2 className="text-sm font-semibold text-foreground">Friends</h2>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="shrink-0 px-4 py-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {search ? "No results." : "No friends yet."}
            </p>
          ) : (
            <div className="pb-2">
              {filtered.map((friend) => (
                <FriendItem key={friend.id} friend={friend} isOwn={isOwn} onClose={onClose} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FriendsModal;

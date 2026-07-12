import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { usePostLikes } from "@/features/post/hooks/usePost";
import UserAvatar from "@/shared/components/common/UserAvatar";

function PostLikesModal({ postId, likeCount, onClose }) {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    usePostLikes(postId, { enabled: true });

  const users = data?.pages.flatMap((p) => p.users) ?? [];

  // Infinite scroll inside the modal list
  useEffect(() => {
    if (!bottomRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { threshold: 0.1 },
    );
    observer.observe(bottomRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleUserClick(userId) {
    onClose();
    navigate(`/profile/${userId}`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-sm flex-col overflow-hidden rounded-t-2xl bg-card sm:rounded-2xl"
        style={{ maxHeight: "80vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold text-foreground">
            {likeCount} {likeCount === 1 ? "like" : "likes"}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* List */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No likes yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {users.map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    onClick={() => handleUserClick(user.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 hover:bg-muted/60"
                  >
                    <UserAvatar user={user} size="lg" />
                    <span className="flex-1 text-left text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                  </button>
                </li>
              ))}
              <li ref={bottomRef} className="flex justify-center py-3">
                {isFetchingNextPage && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostLikesModal;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import UserAvatar from "@/shared/components/common/UserAvatar";

function ReplyItem({ reply, onToggleLike }) {
  const navigate = useNavigate();

  function goToProfile() {
    if (reply.user?.id) navigate(`/profile/${reply.user.id}`);
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={goToProfile} className="shrink-0">
        <UserAvatar user={reply.user} size="sm" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={goToProfile}
              className="text-xs font-semibold text-foreground hover:underline"
            >
              {reply.user?.name}
            </button>
            <p className="mt-0.5 text-xs text-foreground">{reply.content}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggleLike(reply.id)}
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
          >
            <Heart
              className={`h-3 w-3 ${reply.likedByMe ? "fill-red-500 text-red-500" : ""}`}
            />
            {reply.likeCount > 0 && <span>{reply.likeCount}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({ comment, onReply, onToggleLike }) {
  const navigate = useNavigate();
  const [showReplies, setShowReplies] = useState(false);

  function goToProfile() {
    if (comment.user?.id) navigate(`/profile/${comment.user.id}`);
  }

  return (
    <div className="flex gap-2.5">
      <button type="button" onClick={goToProfile} className="shrink-0">
        <UserAvatar user={comment.user} size="md" />
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={goToProfile}
              className="text-xs font-semibold text-foreground hover:underline"
            >
              {comment.user?.name}
            </button>
            <p className="mt-0.5 text-sm text-foreground">{comment.content}</p>
          </div>
          <button
            type="button"
            onClick={() => onToggleLike(comment.id)}
            className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground"
          >
            <Heart
              className={`h-3.5 w-3.5 ${comment.likedByMe ? "fill-red-500 text-red-500" : ""}`}
            />
            {comment.likeCount > 0 && <span>{comment.likeCount}</span>}
          </button>
        </div>

        <div className="mt-1 flex items-center gap-3">
          <button
            type="button"
            onClick={() => onReply(comment)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Reply
          </button>
          {comment.replyCount > 0 && (
            <button
              type="button"
              onClick={() => setShowReplies((v) => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {showReplies ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
              {showReplies
                ? "Hide replies"
                : `${comment.replyCount} ${comment.replyCount === 1 ? "reply" : "replies"}`}
            </button>
          )}
        </div>

        {showReplies && comment.replies?.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-border pl-3">
            {comment.replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} onToggleLike={onToggleLike} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommentItem;

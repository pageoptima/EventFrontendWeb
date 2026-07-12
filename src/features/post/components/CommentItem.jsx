import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import UserAvatar from "@/shared/components/common/UserAvatar";

function ReplyItem({ reply, onToggleLike }) {
  return (
    <div className="flex gap-2">
      <UserAvatar user={reply.user} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground">{reply.user?.name}</span>
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
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className="flex gap-2.5">
      <UserAvatar user={comment.user} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-semibold text-foreground">{comment.user?.name}</span>
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

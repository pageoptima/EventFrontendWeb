import { useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Send, Loader2, AlertCircle } from "lucide-react";
import { usePost, useTogglePostLike } from "@/features/post/hooks/usePost";
import { usePostComments, useCreateComment, useToggleCommentLike } from "@/features/post/hooks/usePostComments";
import PostMediaCarousel from "@/features/post/components/PostMediaCarousel";
import CommentItem from "@/features/post/components/CommentItem";
import PostOptionsMenu from "@/features/post/components/PostOptionsMenu";
import UserAvatar from "@/shared/components/common/UserAvatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

function AuthorRow({ author, postId, currentVisibility, isOwn, className = "" }) {
  if (!author) return null;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${className}`}>
      <UserAvatar user={author} size="lg" />
      <span className="text-sm font-semibold text-foreground">{author.name}</span>
      {isOwn && (
        <PostOptionsMenu postId={postId} currentVisibility={currentVisibility} />
      )}
    </div>
  );
}

function ActionsBar({ post, onToggleLike, isPending }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <button
        type="button"
        onClick={onToggleLike}
        disabled={isPending}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Heart
          className={`h-5 w-5 transition ${post.likedByMe ? "fill-red-500 text-red-500" : ""}`}
        />
        <span>{post.likeCount ?? 0}</span>
      </button>
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <MessageCircle className="h-5 w-5" />
        {post.commentCount ?? 0}
      </span>
    </div>
  );
}

function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const commentInputRef = useRef(null);

  const { data: post, isLoading, error } = usePost(postId);
  const toggleLike = useTogglePostLike(postId);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePostComments(postId);

  const createComment = useCreateComment(postId);
  const { mutate: toggleCommentLike } = useToggleCommentLike(postId);

  const comments = commentsData?.pages.flatMap((p) => p.comments) ?? [];

  function handleSubmitComment(e) {
    e.preventDefault();
    if (!commentText.trim() || createComment.isPending) return;
    createComment.mutate(
      { content: commentText.trim(), parentId: replyTo?.id ?? null },
      {
        onSuccess: () => {
          setCommentText("");
          setReplyTo(null);
        },
      },
    );
  }

  function handleReply(comment) {
    setReplyTo({ id: comment.id, name: comment.user?.name });
    commentInputRef.current?.focus();
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">Failed to load post.</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-muted-foreground underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const isOwn = !!currentUser && !!post.author && currentUser.id === post.author.id;

  const commentInput = (
    <form onSubmit={handleSubmitComment} className="shrink-0 border-t border-border px-4 py-3">
      {replyTo && (
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Replying to {replyTo.name}</p>
          <button
            type="button"
            onClick={() => setReplyTo(null)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          ref={commentInputRef}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="min-w-0 flex-1 rounded-full border border-border bg-muted px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
        />
        <button
          type="submit"
          disabled={!commentText.trim() || createComment.isPending}
          className="shrink-0 rounded-full bg-brand-gradient-h p-2 text-white disabled:opacity-40"
        >
          {createComment.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-5xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="overflow-hidden rounded-2xl border border-border bg-card lg:grid lg:h-150 lg:grid-cols-[minmax(0,1fr)_360px]">

        {/* LEFT column — media + mobile-only author row above it */}
        <div className="flex flex-col lg:border-r lg:border-border">
          {/* Author row — mobile only, sits above the image */}
          <AuthorRow
            author={post.author}
            postId={postId}
            currentVisibility={post.visibility}
            isOwn={isOwn}
            className="shrink-0 border-b border-border lg:hidden"
          />
          <div className="flex-1">
            <PostMediaCarousel medias={post.medias ?? []} />
          </div>
          {/* Actions bar — mobile only, sits below the image */}
          <div className="shrink-0 border-t border-border lg:hidden">
            <ActionsBar
              post={post}
              onToggleLike={() => toggleLike.mutate()}
              isPending={toggleLike.isPending}
            />
          </div>
        </div>

        {/* RIGHT column — desktop only: author, scrollable area, actions, input */}
        <div className="flex flex-col">
          {/* Author row — desktop only, pinned at top */}
          <AuthorRow
            author={post.author}
            postId={postId}
            currentVisibility={post.visibility}
            isOwn={isOwn}
            className="hidden shrink-0 border-b border-border lg:flex"
          />

          {/* Scrollable area: caption + comments (on mobile, page scrolls; on desktop, this div scrolls within h-150) */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3">
            {post.caption && (
              <p className="text-sm text-foreground leading-relaxed">{post.caption}</p>
            )}

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    to={`/search?q=${encodeURIComponent(tag.name)}`}
                    className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            )}

            {commentsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : commentsError ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">Failed to load comments.</p>
              </div>
            ) : comments.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No comments yet.</p>
            ) : (
              <>
                {comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    onToggleLike={toggleCommentLike}
                  />
                ))}
                {hasNextPage && (
                  <button
                    type="button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-50"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more comments"}
                  </button>
                )}
              </>
            )}
          </div>

          {/* Actions bar — desktop only, pinned above comment input */}
          <div className="hidden shrink-0 border-t border-border lg:block">
            <ActionsBar
              post={post}
              onToggleLike={() => toggleLike.mutate()}
              isPending={toggleLike.isPending}
            />
          </div>

          {/* Comment input — always pinned at bottom */}
          {commentInput}
        </div>
      </div>
    </div>
  );
}

export default PostDetailPage;

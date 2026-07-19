import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Send, Loader2, AlertCircle, Bookmark } from "lucide-react";
import { useTeaser, useToggleTeaserLike, useToggleTeaserSave } from "@/features/teaser/hooks/useTeaser";
import {
  useTeaserComments,
  useCreateTeaserComment,
  useToggleTeaserCommentLike,
} from "@/features/teaser/hooks/useTeaserComments";
import TeaserMediaViewer from "@/features/teaser/components/TeaserMediaViewer";
import TeaserCommentItem from "@/features/teaser/components/TeaserCommentItem";
import TeaserOptionsMenu from "@/features/teaser/components/TeaserOptionsMenu";
import TeaserLikesModal from "@/features/teaser/components/TeaserLikesModal";
import UserAvatar from "@/shared/components/common/UserAvatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DESKTOP_SIDEBAR_WIDTH = 380;

function getMediaAspectRatio(media) {
  const width = media?.video_meta?.width ?? null;
  const height = media?.video_meta?.height ?? null;

  if (!width || !height) return 1;

  return width / height;
}

function AuthorRow({ author, teaserId, currentVisibility, isOwn, className = "" }) {
  if (!author) return null;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${className}`}>
      <UserAvatar user={author} size="lg" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{author.name}</span>
      </div>
      {isOwn && (
        <div className="shrink-0">
          <TeaserOptionsMenu teaserId={teaserId} currentVisibility={currentVisibility} />
        </div>
      )}
    </div>
  );
}

function ActionsBar({ teaser, onToggleLike, isPending, onShowLikes, onToggleSave, isSavePending }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <button
        type="button"
        onClick={onToggleLike}
        disabled={isPending}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Heart
          className={`h-5 w-5 transition ${teaser.likedByMe ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>
      <button
        type="button"
        onClick={onShowLikes}
        disabled={(teaser.likeCount ?? 0) === 0}
        className="text-sm font-semibold text-foreground disabled:cursor-default"
      >
        {teaser.likeCount ?? 0} {teaser.likeCount === 1 ? "like" : "likes"}
      </button>
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <MessageCircle className="h-5 w-5" />
        {teaser.commentCount ?? 0}
      </span>
      <button
        type="button"
        onClick={onToggleSave}
        disabled={isSavePending}
        aria-label={teaser.savedByMe ? "Unsave teaser" : "Save teaser"}
        className="ml-auto flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Bookmark
          className={`h-5 w-5 transition ${teaser.savedByMe ? "fill-foreground" : ""}`}
        />
      </button>
    </div>
  );
}

function TeaserDetailPage() {
  const { teaserId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const commentInputRef = useRef(null);

  const [showLikes, setShowLikes] = useState(false);

  const { data: teaser, isLoading, error } = useTeaser(teaserId);
  const toggleLike = useToggleTeaserLike(teaserId);
  const toggleSave = useToggleTeaserSave(teaserId);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useTeaserComments(teaserId);

  const createComment = useCreateTeaserComment(teaserId);
  const { mutate: toggleCommentLike } = useToggleTeaserCommentLike(teaserId);

  const comments = commentsData?.pages.flatMap((p) => p.comments) ?? [];

  useEffect(() => {
    setReplyTo(null);
    setCommentText("");
  }, [teaserId]);

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

  if (error || !teaser) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">Failed to load teaser.</p>
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

  const isOwn = !!currentUser && !!teaser.author && currentUser.id === teaser.author.id;
  const mediaAspectRatio = getMediaAspectRatio(teaser.media);
  const desktopCardStyle = {
    gridTemplateColumns: `minmax(0, max(18rem, min(47.5rem, calc((100vh - 12rem) * ${mediaAspectRatio}), calc(100vw - 44rem)))) ${DESKTOP_SIDEBAR_WIDTH}px`,
  };

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
    <>
    <div className="mx-auto max-w-6xl lg:flex lg:h-[calc(100vh-5.5rem)] lg:flex-col">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 flex shrink-0 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div
        className="w-full overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.28)] lg:mx-auto lg:grid lg:min-h-0 lg:w-fit lg:flex-1"
        style={desktopCardStyle}
      >

        {/* LEFT column — media + mobile-only author row above it */}
        <div className="flex min-w-0 flex-col lg:min-h-0 lg:border-r lg:border-border">
          {/* Author row — mobile only, sits above the media */}
          <AuthorRow
            author={teaser.author}
            teaserId={teaserId}
            currentVisibility={teaser.visibility}
            isOwn={isOwn}
            className="shrink-0 border-b border-border lg:hidden"
          />
          <div className="relative flex-1 lg:min-h-0 lg:overflow-hidden">
            <TeaserMediaViewer media={teaser.media} />
          </div>
          {/* Actions bar — mobile only, sits below the media */}
          <div className="shrink-0 border-t border-border lg:hidden">
            <ActionsBar
              teaser={teaser}
              onToggleLike={() => toggleLike.mutate()}
              isPending={toggleLike.isPending}
              onShowLikes={() => setShowLikes(true)}
              onToggleSave={() => toggleSave.mutate()}
              isSavePending={toggleSave.isPending}
            />
          </div>
        </div>

        {/* RIGHT column — desktop only: author, scrollable area, actions, input */}
        <div className="flex min-h-0 flex-col lg:h-full">
          {/* Author row — desktop only, pinned at top */}
          <AuthorRow
            author={teaser.author}
            teaserId={teaserId}
            currentVisibility={teaser.visibility}
            isOwn={isOwn}
            className="hidden shrink-0 border-b border-border lg:flex"
          />

          {/* Scrollable area: caption + comments */}
          <div className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {teaser.caption && (
              <p className="text-sm text-foreground leading-snug">{teaser.caption}</p>
            )}

            {teaser.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {teaser.tags.map((tag) => (
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
                  <TeaserCommentItem
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
              teaser={teaser}
              onToggleLike={() => toggleLike.mutate()}
              isPending={toggleLike.isPending}
              onShowLikes={() => setShowLikes(true)}
              onToggleSave={() => toggleSave.mutate()}
              isSavePending={toggleSave.isPending}
            />
          </div>

          {/* Comment input — always pinned at bottom */}
          {commentInput}
        </div>
      </div>
    </div>

    {showLikes && (
      <TeaserLikesModal
        teaserId={teaserId}
        likeCount={teaser.likeCount ?? 0}
        onClose={() => setShowLikes(false)}
      />
    )}
    </>
  );
}

export default TeaserDetailPage;

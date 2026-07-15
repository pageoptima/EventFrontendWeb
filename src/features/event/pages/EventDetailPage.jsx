import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Heart, MessageCircle, Send, Loader2, AlertCircle, Calendar, MapPin, Radio } from "lucide-react";
import { useEvent, useToggleEventLike } from "@/features/event/hooks/useEvent";
import { useCountdown } from "@/features/event/hooks/useCountdown";
import { useEventComments, useCreateComment, useToggleCommentLike } from "@/features/event/hooks/useEventComments";
import EventMediaCarousel from "@/features/event/components/EventMediaCarousel";
import CommentItem from "@/features/event/components/CommentItem";
import EventOptionsMenu from "@/features/event/components/EventOptionsMenu";
import EventLikesModal from "@/features/event/components/EventLikesModal";
import UserAvatar from "@/shared/components/common/UserAvatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

const DESKTOP_SIDEBAR_WIDTH = 380;

function getMediaAspectRatio(media) {
  const width = media?.image_meta?.width ?? media?.video_meta?.width ?? null;
  const height = media?.image_meta?.height ?? media?.video_meta?.height ?? null;

  if (!width || !height) return 1;

  return width / height;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

function formatEventDate(dateStr) {
  return dateFormatter.format(new Date(dateStr));
}

function EventDateRow({ startsAt, endsAt }) {
  if (!startsAt) return null;
  return (
    <div className="flex items-start gap-1.5 text-xs">
      <Calendar className="mt-px h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="text-foreground">
        {formatEventDate(startsAt)}
        {endsAt && (
          <>
            <span className="mx-1 text-muted-foreground">→</span>
            {formatEventDate(endsAt)}
          </>
        )}
      </span>
    </div>
  );
}

function EventLocationRow({ location }) {
  if (!location) return null;
  const primary = location.name || location.address;
  const secondary = location.name ? location.address : null;
  return (
    <div className="flex items-start gap-1.5 text-xs">
      <MapPin className="mt-px h-3 w-3 shrink-0 text-muted-foreground" />
      <span className="min-w-0">
        <span className="block text-foreground">{primary}</span>
        {secondary && (
          <span className="block truncate text-[11px] text-muted-foreground">{secondary}</span>
        )}
      </span>
    </div>
  );
}

// ── Countdown overlay ─────────────────────────────────────────────────────────

function CountdownUnit({ value, label, pad = true }) {
  return (
    <div className="flex min-w-[1.25rem] flex-col items-center">
      <span className="text-xs font-bold leading-none tabular-nums text-foreground">
        {pad ? String(value).padStart(2, "0") : String(value)}
      </span>
      <span className="mt-0.5 text-[7px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function CountdownSeparator() {
  return (
    <span className="mb-2.5 self-center text-[10px] font-semibold text-foreground/30">
      :
    </span>
  );
}

function EventCountdownOverlay({ startsAt, endsAt }) {
  const countdown = useCountdown(startsAt, endsAt);

  if (countdown.state === "none" || countdown.state === "ended") return null;

  if (countdown.state === "live") {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 shadow-md">
          <Radio className="h-2.5 w-2.5 animate-pulse text-white" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">
            Live
          </span>
        </div>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = countdown;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex justify-center">
      <div className="rounded-lg border border-border/50 bg-background/80 px-2.5 py-1.5 text-center shadow-md backdrop-blur-md">
        <p className="mb-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Starts in
        </p>
        <div className="flex items-stretch gap-0.5">
          {days > 0 && (
            <>
              <CountdownUnit value={days} label="d" pad={false} />
              <CountdownSeparator />
            </>
          )}
          <CountdownUnit value={hours} label="h" />
          <CountdownSeparator />
          <CountdownUnit value={minutes} label="m" />
          <CountdownSeparator />
          <CountdownUnit value={seconds} label="s" />
        </div>
      </div>
    </div>
  );
}

// ── Author row ────────────────────────────────────────────────────────────────

function AuthorRow({ author, eventId, currentVisibility, isOwn, className = "" }) {
  if (!author) return null;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 ${className}`}>
      <UserAvatar user={author} size="lg" />
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{author.name}</span>
      </div>
      {isOwn && (
        <div className="shrink-0">
          <EventOptionsMenu eventId={eventId} currentVisibility={currentVisibility} />
        </div>
      )}
    </div>
  );
}

function ActionsBar({ event, onToggleLike, isPending, onShowLikes }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <button
        type="button"
        onClick={onToggleLike}
        disabled={isPending}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        <Heart
          className={`h-5 w-5 transition ${event.likedByMe ? "fill-red-500 text-red-500" : ""}`}
        />
      </button>
      <button
        type="button"
        onClick={onShowLikes}
        disabled={(event.likeCount ?? 0) === 0}
        className="text-sm font-semibold text-foreground disabled:cursor-default"
      >
        {event.likeCount ?? 0} {event.likeCount === 1 ? "like" : "likes"}
      </button>
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <MessageCircle className="h-5 w-5" />
        {event.commentCount ?? 0}
      </span>
    </div>
  );
}

function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const commentInputRef = useRef(null);

  const [showLikes, setShowLikes] = useState(false);

  const { data: event, isLoading, error } = useEvent(eventId);
  const toggleLike = useToggleEventLike(eventId);

  const {
    data: commentsData,
    isLoading: commentsLoading,
    error: commentsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useEventComments(eventId);

  const createComment = useCreateComment(eventId);
  const { mutate: toggleCommentLike } = useToggleCommentLike(eventId);

  const comments = commentsData?.pages.flatMap((p) => p.comments) ?? [];

  useEffect(() => {
    setCurrentMediaIndex(0);
  }, [eventId]);

  useEffect(() => {
    if (!event?.medias?.length) {
      setCurrentMediaIndex(0);
      return;
    }

    setCurrentMediaIndex((current) => Math.min(current, event.medias.length - 1));
  }, [event?.medias]);

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

  if (error || !event) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <p className="text-sm text-destructive">Failed to load event.</p>
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

  const isOwn = !!currentUser && !!event.author && currentUser.id === event.author.id;
  const activeMedia = event.medias?.[currentMediaIndex] ?? event.medias?.[0] ?? null;
  const activeMediaAspectRatio = getMediaAspectRatio(activeMedia);
  const desktopCardStyle = {
    gridTemplateColumns: `minmax(0, max(18rem, min(47.5rem, calc((100vh - 12rem) * ${activeMediaAspectRatio}), calc(100vw - 44rem)))) ${DESKTOP_SIDEBAR_WIDTH}px`,
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
          {/* Author row — mobile only, sits above the image */}
          <AuthorRow
            author={event.author}
            eventId={eventId}
            currentVisibility={event.visibility}
            isOwn={isOwn}
            className="shrink-0 border-b border-border lg:hidden"
          />
          <div className="relative flex-1 lg:min-h-0 lg:overflow-hidden">
            <EventMediaCarousel
              medias={event.medias ?? []}
              current={currentMediaIndex}
              onChange={setCurrentMediaIndex}
            />
            <EventCountdownOverlay startsAt={event.startsAt} endsAt={event.endsAt} />
          </div>
          {/* Actions bar — mobile only, sits below the image */}
          <div className="shrink-0 border-t border-border lg:hidden">
            <ActionsBar
              event={event}
              onToggleLike={() => toggleLike.mutate()}
              isPending={toggleLike.isPending}
              onShowLikes={() => setShowLikes(true)}
            />
          </div>
        </div>

        {/* RIGHT column — desktop only: author, scrollable area, actions, input */}
        <div className="flex min-h-0 flex-col lg:h-full">
          {/* Author row — desktop only, pinned at top */}
          <AuthorRow
            author={event.author}
            eventId={eventId}
            currentVisibility={event.visibility}
            isOwn={isOwn}
            className="hidden shrink-0 border-b border-border lg:flex"
          />

          {/* Scrollable area: caption + comments (on mobile, page scrolls; on desktop, this div scrolls within h-150) */}
          <div className="no-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-3">
            {event.caption && (
              <p className="text-sm text-foreground leading-snug">{event.caption}</p>
            )}

            <EventDateRow startsAt={event.startsAt} endsAt={event.endsAt} />
            <EventLocationRow location={event.location} />

            {event.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {event.tags.map((tag) => (
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
              event={event}
              onToggleLike={() => toggleLike.mutate()}
              isPending={toggleLike.isPending}
              onShowLikes={() => setShowLikes(true)}
            />
          </div>

          {/* Comment input — always pinned at bottom */}
          {commentInput}
        </div>
      </div>
    </div>

    {showLikes && (
      <EventLikesModal
        eventId={eventId}
        likeCount={event.likeCount ?? 0}
        onClose={() => setShowLikes(false)}
      />
    )}
    </>
  );
}

export default EventDetailPage;

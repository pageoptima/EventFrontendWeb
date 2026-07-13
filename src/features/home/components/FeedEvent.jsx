import AppButton from "@/shared/components/common/AppButton";
import heartIcon from "@/assets/icons/heart-red.svg";
import voiceIcon from "@/assets/icons/voice.svg";
import commentIcon from "@/assets/icons/chat-black.svg";
import shareIcon from "@/assets/icons/share.svg";
import bookmarkIcon from "@/assets/icons/bookmark.svg";

function FeedEvent({ event }) {
  return (
    <article className="rounded-xl border border-border bg-card">
      <header className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0 rounded-full bg-brand-gradient p-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-600">
              {event.user.name.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {event.user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {event.user.handle}
            </p>
          </div>
        </div>
        <AppButton className="ml-3 h-8 w-24 shrink-0 cursor-pointer rounded-md bg-brand-gradient-h px-0 text-xs font-semibold text-white shadow-sm hover:opacity-90 sm:h-9.5 sm:w-27.5">
          Follow
        </AppButton>
      </header>

      <div className="px-4 pb-4">
        <div className="w-full overflow-hidden rounded-xl border border-border bg-muted">
          <img
            src={event.image}
            alt={`${event.user.name} event`}
            loading="lazy"
            className="h-64 w-full object-cover sm:h-80 lg:h-96"
          />
        </div>

        <div className="mt-3 flex items-center gap-4 text-sm text-foreground">
          <button
            type="button"
            aria-label={`${event.likes} likes`}
            className="flex items-center gap-2 font-medium"
          >
            <img src={heartIcon} alt="" className="h-5 w-5" />
            <span>{event.likes}</span>
          </button>

          <button
            type="button"
            aria-label="Voice note"
            className="flex items-center"
          >
            <img src={voiceIcon} alt="" className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label={`${event.comments} comments`}
            className="flex items-center gap-2 font-medium"
          >
            <img src={commentIcon} alt="" className="h-5 w-5" />
            <span>{event.comments}</span>
          </button>

          <button
            type="button"
            aria-label="Share event"
            className="flex items-center"
          >
            <img src={shareIcon} alt="" className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Save event"
            className="ml-auto flex items-center"
          >
            <img src={bookmarkIcon} alt="" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default FeedEvent;

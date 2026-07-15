import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Images, MapPin } from "lucide-react";

const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short" });

function getShortLocation(location) {
  if (!location) return null;
  return (
    location.locality ||
    location.state ||
    location.country ||
    location.name?.split(",")[0] ||
    null
  );
}

function DateBadge({ startsAt }) {
  if (!startsAt) return null;
  const d = new Date(startsAt);
  return (
    <div className="absolute right-2 top-2 z-10 flex flex-col items-center rounded-md bg-background/85 px-1.5 py-1 shadow-sm backdrop-blur-sm">
      <span className="text-sm font-bold leading-none text-foreground">
        {d.getDate()}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase leading-none text-muted-foreground">
        {monthFmt.format(d)}
      </span>
    </div>
  );
}

function LocationStrip({ location }) {
  const label = getShortLocation(location);
  if (!label) return null;
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 bg-linear-to-t from-black/65 to-transparent px-2 pb-1.5 pt-5">
      <div className="flex items-center gap-1">
        <MapPin className="h-2.5 w-2.5 shrink-0 text-white/75" />
        <span className="truncate text-[10px] font-medium text-white/90">
          {label}
        </span>
      </div>
    </div>
  );
}

function GalleryCard({ event }) {
  const navigate = useNavigate();
  const firstMedia = event.medias?.[0];
  const isVideo = firstMedia?.type === "VIDEO";
  const thumbUrl = isVideo
    ? (firstMedia?.video_meta?.thumbnailUrl ?? firstMedia?.url)
    : firstMedia?.url;
  const hasMultiple = (event.medias?.length ?? 0) > 1;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/events/${event.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/events/${event.id}`)}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-muted"
    >
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={event.caption ?? "Event"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-muted" />
      )}

      {/* Multiple-media indicator — top-left */}
      {hasMultiple && (
        <div className="absolute left-2 top-2 z-10 rounded-md bg-black/50 p-1">
          <Images className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      {/* Date badge — top-right */}
      <DateBadge startsAt={event.startsAt} />

      {/* Location strip — bottom */}
      <LocationStrip location={event.location} />

      {/* Hover overlay — like / comment counts */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-5 bg-black/40 text-white opacity-0 transition duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Heart className="h-4 w-4 fill-white" />
          {event.likeCount ?? 0}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <MessageCircle className="h-4 w-4 fill-white" />
          {event.commentCount ?? 0}
        </span>
      </div>
    </article>
  );
}

export default GalleryCard;

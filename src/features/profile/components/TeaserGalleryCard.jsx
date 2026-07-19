import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, PlaySquare } from "lucide-react";

// The backend only allows VIDEO media for teasers (see useCreateTeaser.js),
// so the thumbnail always comes from video_meta and the badge is unconditional.
function TeaserGalleryCard({ teaser }) {
  const navigate = useNavigate();
  const media = teaser.media;
  const thumbUrl = media?.video_meta?.thumbnailUrl ?? media?.url;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/teasers/${teaser.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/teasers/${teaser.id}`)}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-muted"
    >
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={teaser.caption ?? "Teaser"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-muted" />
      )}

      {/* Video indicator — top-left */}
      <div className="absolute left-2 top-2 z-10 rounded-md bg-black/50 p-1">
        <PlaySquare className="h-3.5 w-3.5 text-white" />
      </div>

      {/* Hover overlay — like / comment counts */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-5 bg-black/40 text-white opacity-0 transition duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Heart className="h-4 w-4 fill-white" />
          {teaser.likeCount ?? 0}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <MessageCircle className="h-4 w-4 fill-white" />
          {teaser.commentCount ?? 0}
        </span>
      </div>
    </article>
  );
}

export default TeaserGalleryCard;

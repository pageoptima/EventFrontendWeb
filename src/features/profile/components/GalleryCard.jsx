import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Images } from "lucide-react";

function GalleryCard({ post }) {
  const navigate = useNavigate();
  const firstMedia = post.medias?.[0];
  const isVideo = firstMedia?.type === "VIDEO";
  const thumbUrl = isVideo
    ? (firstMedia?.video_meta?.thumbnailUrl ?? firstMedia?.url)
    : firstMedia?.url;
  const hasMultiple = (post.medias?.length ?? 0) > 1;

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/posts/${post.id}`)}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/posts/${post.id}`)}
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-border bg-muted"
    >
      {thumbUrl ? (
        <img
          src={thumbUrl}
          alt={post.caption ?? "Post"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full animate-pulse bg-muted" />
      )}

      {hasMultiple && (
        <div className="absolute right-2 top-2 rounded-md bg-black/50 p-1">
          <Images className="h-3.5 w-3.5 text-white" />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-5 bg-black/40 text-white opacity-0 transition duration-200 group-hover:opacity-100">
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <Heart className="h-4 w-4 fill-white" />
          {post.likeCount ?? 0}
        </span>
        <span className="flex items-center gap-1.5 text-sm font-semibold">
          <MessageCircle className="h-4 w-4 fill-white" />
          {post.commentCount ?? 0}
        </span>
      </div>
    </article>
  );
}

export default GalleryCard;

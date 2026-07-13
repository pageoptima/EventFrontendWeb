import { ChevronLeft, ChevronRight } from "lucide-react";

function PostMediaCarousel({ medias = [], current = 0, onChange }) {
  function setCurrent(nextIndex) {
    onChange?.(nextIndex);
  }

  if (medias.length === 0) {
    return <div className="aspect-square w-full bg-muted lg:h-full lg:aspect-auto" />;
  }

  const media = medias[current];
  const isVideo = media?.type === "VIDEO";

  return (
    <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden bg-[#05010f]">
      <div className="relative aspect-square w-full overflow-hidden lg:h-full lg:aspect-auto">
        {isVideo ? (
          <video
            key={media.url}
            src={media.url}
            controls
            className="h-full w-full object-contain"
          />
        ) : (
          <img
            key={media.url ?? current}
            src={media.url ?? undefined}
            alt={`Media ${current + 1}`}
            className="h-full w-full object-contain"
          />
        )}
      </div>

      {medias.length > 1 && (
        <>
          {current > 0 && (
            <button
              type="button"
              onClick={() => setCurrent((c) => c - 1)}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {current < medias.length - 1 && (
            <button
              type="button"
              onClick={() => setCurrent((c) => c + 1)}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
            {medias.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrent(i)}
                className={`h-1.5 w-1.5 rounded-full transition ${
                  i === current ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PostMediaCarousel;

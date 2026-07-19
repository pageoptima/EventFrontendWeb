import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

// The backend only allows VIDEO media for teasers (see useCreateTeaser.js),
// so this never needs to branch on media type.
function TeaserMediaViewer({ media }) {
  const videoRef = useRef(null);
  const mutedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const playWithFallback = useCallback(async (video) => {
    if (!video) return;

    video.muted = mutedRef.current;
    try {
      await video.play();
    } catch {
      // Autoplay with sound is blocked without a prior user gesture — leave
      // sound on and stay paused. The next tap is a real user gesture, so
      // the browser will allow it to play with sound.
    }
  }, []);

  useEffect(() => {
    playWithFallback(videoRef.current);
  }, [media?.url, playWithFallback]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      playWithFallback(video);
    } else {
      video.pause();
    }
  }, [playWithFallback]);

  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !mutedRef.current;
    mutedRef.current = nextMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  if (!media) {
    return <div className="aspect-square w-full bg-muted lg:h-full lg:aspect-auto" />;
  }

  return (
    <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden bg-[#05010f]">
      <div className="relative aspect-square w-full overflow-hidden lg:h-full lg:aspect-auto">
        <video
          ref={videoRef}
          key={media.url}
          src={media.url}
          poster={media.video_meta?.thumbnailUrl}
          loop
          playsInline
          preload="auto"
          onClick={togglePlayback}
          onPlay={() => setIsPaused(false)}
          onPause={() => setIsPaused(true)}
          aria-label={isPaused ? "Play teaser" : "Pause teaser"}
          className="h-full w-full cursor-pointer object-contain"
        />

        {isPaused && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.34)] backdrop-blur-sm">
              <Play className="ml-0.5 h-7 w-7 text-white" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute teaser" : "Mute teaser"}
          className="absolute bottom-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

export default TeaserMediaViewer;

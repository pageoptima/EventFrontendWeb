import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import TeaserActionRail from "@/features/teaser/components/TeaserActionRail";
import TeaserMetaOverlay from "@/features/teaser/components/TeaserMetaOverlay";

function TeaserSlide({ teaser, profile, shouldPreload = false }) {
  const slideRef = useRef(null);
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(() => shouldPreload);
  const mutedRef = useRef(false);
  const pausedByUserRef = useRef(false);
  const isInViewportRef = useRef(false);

  useEffect(() => {
    if (shouldLoadVideo) return;

    const slide = slideRef.current;
    if (!slide) return;

    const preloadObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        setShouldLoadVideo(true);
        preloadObserver.disconnect();
      },
      { rootMargin: "150% 0px", threshold: 0.01 },
    );

    preloadObserver.observe(slide);
    return () => preloadObserver.disconnect();
  }, [shouldLoadVideo]);

  useEffect(() => {
    mutedRef.current = isMuted;
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted]);

  const playWithFallback = useCallback(async (video) => {
    if (!video) return;

    video.muted = mutedRef.current;
    try {
      await video.play();
      setIsPaused(false);
    } catch {
      // Browser blocks autoplay with sound until user interaction.
      video.muted = true;
      mutedRef.current = true;
      setIsMuted(true);
      video.play().catch(() => {});
      setIsPaused(false);
    }
  }, []);

  useEffect(() => {
    const slide = slideRef.current;
    const video = videoRef.current;
    if (!slide || !video || !shouldLoadVideo) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewportRef.current = entry.isIntersecting;
          if (entry.isIntersecting) {
            if (pausedByUserRef.current) return;
            playWithFallback(video);
          } else {
            video.pause();
            pausedByUserRef.current = false;
            setIsPaused(false);
          }
        });
      },
      { threshold: 0.8 },
    );

    observer.observe(slide);
    return () => observer.disconnect();
  }, [playWithFallback, shouldLoadVideo]);

  const handleVideoLoadedData = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!isInViewportRef.current || pausedByUserRef.current) return;
    playWithFallback(video);
  }, [playWithFallback]);

  const toggleAudio = useCallback(() => {
    if (!shouldLoadVideo) {
      setShouldLoadVideo(true);
      return;
    }

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    const video = videoRef.current;
    if (!video) return;

    video.muted = nextMuted;
    if (!pausedByUserRef.current) {
      video.play().catch(() => {});
    }
  }, [isMuted, shouldLoadVideo]);

  const togglePlayback = useCallback(async () => {
    if (!shouldLoadVideo) {
      pausedByUserRef.current = false;
      setShouldLoadVideo(true);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      pausedByUserRef.current = false;
      await playWithFallback(video);
      return;
    }

    pausedByUserRef.current = true;
    video.pause();
    setIsPaused(true);
  }, [playWithFallback, shouldLoadVideo]);

  return (
    <div
      ref={slideRef}
      className="snap-start flex h-[calc(100vh-3rem)] items-center justify-center px-4"
    >
      <div className="flex items-center gap-4 sm:gap-6">
        <article className="relative h-[78vh] min-h-[520px] max-h-[720px] aspect-[9/16] overflow-hidden rounded-[14px] bg-black shadow-xl">
          <video
            ref={videoRef}
            src={shouldLoadVideo ? teaser.video : undefined}
            poster={teaser.image}
            loop
            playsInline
            preload={shouldLoadVideo ? "metadata" : "none"}
            onLoadedData={handleVideoLoadedData}
            onClick={togglePlayback}
            aria-label={isPaused ? "Resume teaser" : "Pause teaser"}
            className="h-full w-full cursor-pointer object-cover"
          />

          {isPaused ? (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(255,255,255,0.34)] backdrop-blur-sm">
                <Play className="ml-0.5 h-7 w-7 text-white" />
              </div>
            </div>
          ) : null}

          <TeaserMetaOverlay teaser={teaser} profile={profile} />
        </article>

        <TeaserActionRail
          teaser={teaser}
          isMuted={isMuted}
          onToggleAudio={toggleAudio}
        />
      </div>
    </div>
  );
}

export default TeaserSlide;

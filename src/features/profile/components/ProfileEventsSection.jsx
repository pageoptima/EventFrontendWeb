import { useRef, useEffect } from "react";
import { Grid3X3, PlaySquare } from "lucide-react";
import GalleryCard from "@/features/profile/components/GalleryCard";
import { useUserEvents } from "@/features/event/hooks/useUserEvents";

const tabs = [
  { key: "events", label: "Event", Icon: Grid3X3 },
  { key: "teaser", label: "Teaser", Icon: PlaySquare },
];

function EventsGrid({ userId }) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useUserEvents(userId);
  const loaderRef = useRef(null);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="mt-3 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  const events = data?.pages.flatMap((page) => page.posts) ?? [];

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center">
        <p className="text-sm text-muted-foreground">No events yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {events.map((event) => (
          <GalleryCard key={event.id} event={event} />
        ))}
      </div>
      <div ref={loaderRef} className="py-2">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </div>
        )}
      </div>
    </>
  );
}

function ProfileEventsSection({ activeTab, onTabChange, userId }) {
  return (
    <div className="border-t border-border px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
      <div className="grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <tab.Icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "events" ? (
        <EventsGrid userId={userId} />
      ) : (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <p className="text-sm text-muted-foreground">No {activeTab} yet.</p>
        </div>
      )}
    </div>
  );
}

export default ProfileEventsSection;

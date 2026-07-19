import { useRef, useEffect, useState } from "react";
import { Bookmark, Grid3X3, PlaySquare } from "lucide-react";
import GalleryCard from "@/features/profile/components/GalleryCard";
import TeaserGalleryCard from "@/features/profile/components/TeaserGalleryCard";
import { useSavedEvents } from "@/features/event/hooks/useSavedEvents";
import { useSavedTeasers } from "@/features/teaser/hooks/useSavedTeasers";

const tabs = [
  {
    key: "events",
    label: "Events",
    Icon: Grid3X3,
    useSaved: useSavedEvents,
    dataKey: "posts",
    renderItem: (event) => <GalleryCard key={event.id} event={event} />,
  },
  {
    key: "teasers",
    label: "Teasers",
    Icon: PlaySquare,
    useSaved: useSavedTeasers,
    dataKey: "teasers",
    renderItem: (teaser) => <TeaserGalleryCard key={teaser.id} teaser={teaser} />,
  },
];

function EmptyState({ label }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Bookmark className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">Nothing saved yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {label} you bookmark will appear here.
        </p>
      </div>
    </div>
  );
}

function useInfiniteScrollTrigger({ hasNextPage, isFetchingNextPage, fetchNextPage }) {
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

  return loaderRef;
}

function SavedGrid({ tab }) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = tab.useSaved();
  const loaderRef = useInfiniteScrollTrigger({ hasNextPage, isFetchingNextPage, fetchNextPage });

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  const items = data?.pages.flatMap((page) => page[tab.dataKey]) ?? [];

  if (items.length === 0) {
    return <EmptyState label={tab.label} />;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {items.map(tab.renderItem)}
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

function SavedPanel() {
  const [activeTab, setActiveTab] = useState(tabs[0].key);
  const activeTabConfig = tabs.find((tab) => tab.key === activeTab);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Saved</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Events and teasers you've bookmarked.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
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

      <SavedGrid key={activeTabConfig.key} tab={activeTabConfig} />
    </div>
  );
}

export default SavedPanel;

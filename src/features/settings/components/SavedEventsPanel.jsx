import { Bookmark } from "lucide-react";

function SavedEventsPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Saved Events</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Events you've bookmarked.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Bookmark className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Coming soon</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved events will appear here once the feature is ready.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SavedEventsPanel;

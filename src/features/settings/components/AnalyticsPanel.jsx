import { BarChart2 } from "lucide-react";

function AnalyticsPanel() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Analytics</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">Insights about your activity.</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20 gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <BarChart2 className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground">Coming soon</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Profile analytics and insights will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPanel;

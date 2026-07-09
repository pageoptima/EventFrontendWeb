import { CalendarPlus } from "lucide-react";

function CreateLiveEventPage() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
      <CalendarPlus className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-base font-medium text-foreground">Create Event</p>
      <p className="text-sm text-muted-foreground">Coming soon</p>
    </div>
  );
}

export default CreateLiveEventPage;

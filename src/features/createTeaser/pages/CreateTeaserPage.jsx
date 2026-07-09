import { Clapperboard } from "lucide-react";

function CreateTeaserPage() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
      <Clapperboard className="h-10 w-10 text-muted-foreground/40" />
      <p className="text-base font-medium text-foreground">Create Teaser</p>
      <p className="text-sm text-muted-foreground">Coming soon</p>
    </div>
  );
}

export default CreateTeaserPage;

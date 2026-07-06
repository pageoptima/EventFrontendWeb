import RightSidebar from "@/shared/components/RightSidebar";

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section>
        <div className="overflow-hidden rounded-2xl border border-border">

          {/* Cover + Avatar */}
          <div className="relative h-48 sm:h-56">
            <div className="h-full w-full animate-pulse bg-muted" />
            <div className="absolute -bottom-10 left-4 h-21 w-21 rounded-full bg-muted ring-4 ring-white animate-pulse sm:left-6 sm:h-31 sm:w-31" />
          </div>

          {/* Profile body */}
          <div className="space-y-5 px-4 pb-5 pt-12 sm:px-6 sm:pb-6 sm:pt-21">

            {/* Name + button row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="h-8 w-44 animate-pulse rounded-lg bg-muted" />
              <div className="h-8.5 w-28 animate-pulse rounded-full bg-muted" />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-7">
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
              <div className="h-4 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>

          {/* Tab bar */}
          <div className="border-t border-border px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-9 animate-pulse rounded-lg bg-muted" />
              <div className="h-9 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>

        </div>
      </section>
      <RightSidebar />
    </div>
  );
}

export default ProfileSkeleton;

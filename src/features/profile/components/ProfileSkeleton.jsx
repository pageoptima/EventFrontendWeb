import RightSidebar from "@/shared/components/RightSidebar";

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section>
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="h-48 animate-pulse bg-muted sm:h-56" />
          <div className="space-y-4 px-4 pb-6 pt-16 sm:px-6">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </section>
      <RightSidebar />
    </div>
  );
}

export default ProfileSkeleton;

import { useState } from "react";
import { useParams } from "react-router-dom";
import RightSidebar from "@/shared/components/RightSidebar";
import ProfileDetailsSection from "@/features/profile/components/ProfileDetailsSection";
import ProfilePostsSection from "@/features/profile/components/ProfilePostsSection";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import { useUserProfile } from "@/features/profile/hooks/useProfile";

function UserProfilePage() {
  const { id } = useParams();
  const { data: profile, isLoading, error } = useUserProfile(id);
  const [activeTab, setActiveTab] = useState("events");

  if (isLoading) return <ProfileSkeleton />;

  if (error || !profile) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
        <section>
          <div className="flex items-center justify-center rounded-2xl border border-border py-16">
            <p className="text-sm text-destructive">
              {error ? "Failed to load profile." : "User not found."}
            </p>
          </div>
        </section>
        <RightSidebar />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section>
        <article className="overflow-hidden rounded-2xl border border-border">
          <ProfileDetailsSection
            profile={profile}
            isOwn={profile.isMe}
          />
          <ProfilePostsSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            postsByTab={{ events: [], teaser: [] }}
          />
        </article>
      </section>
      <RightSidebar />
    </div>
  );
}

export default UserProfilePage;

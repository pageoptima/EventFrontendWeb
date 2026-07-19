import { useParams } from "react-router-dom";
import RightSidebar from "@/shared/components/RightSidebar";
import ProfileDetailsSection from "@/features/profile/components/ProfileDetailsSection";
import ProfileEventsSection from "@/features/profile/components/ProfileEventsSection";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import { useUserProfile } from "@/features/profile/hooks/useProfile";
import { useFriendActions } from "@/features/friend/hooks/useFriendActions";
import { useTabSearchParam } from "@/shared/hooks/useTabSearchParam";

const DEFAULT_TAB = "events";
const VALID_TABS = [DEFAULT_TAB, "teaser"];

function UserProfilePage() {
  const { id } = useParams();
  const { data: profile, isLoading, error } = useUserProfile(id);
  const actions = useFriendActions(id);
  const [activeTab, setActiveTab] = useTabSearchParam(DEFAULT_TAB, VALID_TABS);

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

  const requestId = profile.relationship?.requestId ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section>
        <article className="overflow-hidden rounded-2xl border border-border">
          <ProfileDetailsSection
            profile={profile}
            isOwn={profile.isMe}
            onAddFriend={actions.sendRequest}
            onAcceptRequest={() => actions.acceptRequest(requestId)}
            onDeleteRequest={() => actions.deleteRequest(requestId)}
            onUnfriend={actions.unfriend}
            onBlock={actions.block}
            onUnblock={actions.unblock}
            friendActionPending={actions.isPending}
            profileUserId={id}
          />
          <ProfileEventsSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            userId={profile.id}
          />
        </article>
      </section>
      <RightSidebar />
    </div>
  );
}

export default UserProfilePage;

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import RightSidebar from "@/shared/components/RightSidebar";
import ProfileDetailsSection from "@/features/profile/components/ProfileDetailsSection";
import ProfilePostsSection from "@/features/profile/components/ProfilePostsSection";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";
import { useMyProfile } from "@/features/profile/hooks/useProfile";
import { profileKeys } from "@/features/profile/queryKeys";
import {
  updateProfilePicture,
  updateCoverPicture,
} from "@/features/profile/services/profileService";
import { patchUser } from "@/stores/slices/authSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data: profile, isLoading, error, refetch } = useMyProfile();
  const [activeTab, setActiveTab] = useState("posts");

  const pictureMutation = useMutation({
    mutationFn: updateProfilePicture,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me(), (old) => ({
        ...old,
        profilePicture: data.profilePicture,
      }));
      dispatch(patchUser({ profilePicture: data.profilePicture }));
    },
  });

  const coverMutation = useMutation({
    mutationFn: updateCoverPicture,
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me(), (old) => ({
        ...old,
        coverPicture: data.coverPicture,
      }));
    },
  });

  const uploadError =
    pictureMutation.error?.message ||
    coverMutation.error?.message ||
    "";

  if (isLoading) return <ProfileSkeleton />;

  if (error) {
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
        <section>
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-border py-16 text-center">
            <p className="text-sm text-destructive">Failed to load profile.</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-full bg-brand-gradient-h px-4 py-1.5 text-xs font-semibold text-white"
            >
              Retry
            </button>
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
            isOwn
            onProfilePictureChange={(file) => pictureMutation.mutate(file)}
            onCoverPictureChange={(file) => coverMutation.mutate(file)}
            uploadingPicture={pictureMutation.isPending}
            uploadingCover={coverMutation.isPending}
            uploadError={uploadError}
          />
          <ProfilePostsSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            postsByTab={{ posts: [], events: [], teaser: [] }}
          />
        </article>
      </section>
      <RightSidebar />
    </div>
  );
}

export default ProfilePage;

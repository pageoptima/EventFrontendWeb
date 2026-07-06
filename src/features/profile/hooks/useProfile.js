import { useQuery } from "@tanstack/react-query";
import { getMyProfile, getUserProfile } from "@/features/profile/services/profileService";
import { profileKeys } from "@/features/profile/queryKeys";

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
  });
}

export function useUserProfile(id) {
  return useQuery({
    queryKey: profileKeys.user(id),
    queryFn: () => getUserProfile(id),
    enabled: Boolean(id),
  });
}

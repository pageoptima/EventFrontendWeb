import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/features/profile/services/profileService";
import { profileKeys } from "@/features/profile/queryKeys";

export function useUserProfile(id) {
  return useQuery({
    queryKey: profileKeys.user(id),
    queryFn: () => getUserProfile(id),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 2,
  });
}

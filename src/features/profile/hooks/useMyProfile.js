import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/features/profile/services/profileService";
import { profileKeys } from "@/features/profile/queryKeys";

export function useMyProfile() {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: getMyProfile,
  });
}

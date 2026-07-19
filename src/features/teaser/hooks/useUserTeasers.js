import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserTeasers } from "@/features/teaser/services/teaserService";
import { teaserKeys } from "@/features/teaser/teaserQueryKeys";

export function useUserTeasers(userId) {
  return useInfiniteQuery({
    queryKey: teaserKeys.userTeasers(userId),
    queryFn: ({ pageParam }) => getUserTeasers({ userId, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!userId,
    staleTime: 45 * 60 * 1000,
  });
}

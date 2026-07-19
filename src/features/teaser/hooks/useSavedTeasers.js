import { useInfiniteQuery } from "@tanstack/react-query";
import { getSavedTeasers } from "@/features/teaser/services/teaserService";
import { teaserKeys } from "@/features/teaser/teaserQueryKeys";

export function useSavedTeasers() {
  return useInfiniteQuery({
    queryKey: teaserKeys.saved(),
    queryFn: ({ pageParam }) => getSavedTeasers({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}

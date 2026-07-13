import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserEvents } from "@/features/event/services/eventService";
import { eventKeys } from "@/features/event/eventQueryKeys";

export function useUserEvents(userId) {
  return useInfiniteQuery({
    queryKey: eventKeys.userEvents(userId),
    queryFn: ({ pageParam }) => getUserEvents({ userId, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!userId,
    staleTime: 45 * 60 * 1000,
  });
}

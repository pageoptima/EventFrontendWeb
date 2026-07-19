import { useInfiniteQuery } from "@tanstack/react-query";
import { getSavedEvents } from "@/features/event/services/eventService";
import { eventKeys } from "@/features/event/eventQueryKeys";

export function useSavedEvents() {
  return useInfiniteQuery({
    queryKey: eventKeys.saved(),
    queryFn: ({ pageParam }) => getSavedEvents({ cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
  });
}

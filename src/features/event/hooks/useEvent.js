import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getEvent,
  toggleEventLike,
  getEventLikes,
  deleteEvent,
  changeEventVisibility,
} from "@/features/event/services/eventService";
import { eventKeys } from "@/features/event/eventQueryKeys";

export function useEvent(eventId) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
    staleTime: 45 * 60 * 1000,
  });
}

export function useToggleEventLike(eventId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleEventLike(eventId),
    onMutate: async () => {
      // Cancel in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: eventKeys.detail(eventId) });

      // Snapshot current state for rollback
      const previous = queryClient.getQueryData(eventKeys.detail(eventId));

      // Immediately flip the UI
      queryClient.setQueryData(eventKeys.detail(eventId), (old) => {
        if (!old) return old;
        const liked = !old.likedByMe;
        return {
          ...old,
          likedByMe: liked,
          likeCount: liked ? old.likeCount + 1 : Math.max(0, old.likeCount - 1),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Revert to snapshot if API fails
      if (context?.previous !== undefined) {
        queryClient.setQueryData(eventKeys.detail(eventId), context.previous);
      }
    },
    onSuccess: (data) => {
      // Sync with server truth (corrects any count discrepancy)
      queryClient.setQueryData(eventKeys.detail(eventId), (old) =>
        old ? { ...old, likeCount: data.likeCount, likedByMe: data.liked } : old,
      );
    },
  });
}

export function useEventLikes(eventId, { enabled = false } = {}) {
  return useInfiniteQuery({
    queryKey: eventKeys.likes(eventId),
    queryFn: ({ pageParam }) =>
      getEventLikes({
        eventId,
        cursorUserId: pageParam?.userId,
        cursorCreatedAt: pageParam?.createdAt,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!eventId && enabled,
  });
}

export function useDeleteEvent(eventId) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: eventKeys.detail(eventId) });
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents("me") });
      navigate(-1);
    },
  });
}

export function useChangeEventVisibility(eventId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (visibility) => changeEventVisibility(eventId, visibility),
    onSuccess: (_, visibility) => {
      queryClient.setQueryData(eventKeys.detail(eventId), (old) =>
        old ? { ...old, visibility } : old,
      );
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents("me") });
    },
  });
}

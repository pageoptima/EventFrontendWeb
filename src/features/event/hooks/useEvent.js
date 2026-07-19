import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getEvent,
  toggleEventLike,
  getEventLikes,
  deleteEvent,
  changeEventVisibility,
  toggleEventSave,
} from "@/features/event/services/eventService";
import { eventKeys } from "@/features/event/eventQueryKeys";
import { useOptimisticToggleMutation } from "@/shared/hooks/useOptimisticToggleMutation";

export function useEvent(eventId) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => getEvent(eventId),
    enabled: !!eventId,
    staleTime: 45 * 60 * 1000,
  });
}

export function useToggleEventLike(eventId) {
  return useOptimisticToggleMutation({
    queryKey: eventKeys.detail(eventId),
    mutationFn: () => toggleEventLike(eventId),
    applyOptimistic: (old) => {
      const liked = !old.likedByMe;
      return {
        ...old,
        likedByMe: liked,
        likeCount: liked ? old.likeCount + 1 : Math.max(0, old.likeCount - 1),
      };
    },
    applyServerSync: (old, data) => ({ ...old, likeCount: data.likeCount, likedByMe: data.liked }),
  });
}

export function useToggleEventSave(eventId) {
  return useOptimisticToggleMutation({
    queryKey: eventKeys.detail(eventId),
    mutationFn: () => toggleEventSave(eventId),
    applyOptimistic: (old) => ({ ...old, savedByMe: !old.savedByMe }),
    applyServerSync: (old, data) => ({ ...old, savedByMe: data.saved }),
    // The saved-list view is a separate collection — simplest to
    // refetch it rather than reconcile an optimistic patch against it.
    onSuccess: (_data, queryClient) => queryClient.invalidateQueries({ queryKey: eventKeys.saved() }),
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

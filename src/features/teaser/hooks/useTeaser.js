import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getTeaser,
  toggleTeaserLike,
  getTeaserLikes,
  deleteTeaser,
  changeTeaserVisibility,
  toggleTeaserSave,
} from "@/features/teaser/services/teaserService";
import { teaserKeys } from "@/features/teaser/teaserQueryKeys";
import { useOptimisticToggleMutation } from "@/shared/hooks/useOptimisticToggleMutation";

export function useTeaser(teaserId) {
  return useQuery({
    queryKey: teaserKeys.detail(teaserId),
    queryFn: () => getTeaser(teaserId),
    enabled: !!teaserId,
    staleTime: 45 * 60 * 1000,
  });
}

export function useToggleTeaserLike(teaserId) {
  return useOptimisticToggleMutation({
    queryKey: teaserKeys.detail(teaserId),
    mutationFn: () => toggleTeaserLike(teaserId),
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

export function useToggleTeaserSave(teaserId) {
  return useOptimisticToggleMutation({
    queryKey: teaserKeys.detail(teaserId),
    mutationFn: () => toggleTeaserSave(teaserId),
    applyOptimistic: (old) => ({ ...old, savedByMe: !old.savedByMe }),
    applyServerSync: (old, data) => ({ ...old, savedByMe: data.saved }),
    // The saved-list view is a separate collection — simplest to
    // refetch it rather than reconcile an optimistic patch against it.
    onSuccess: (_data, queryClient) => queryClient.invalidateQueries({ queryKey: teaserKeys.saved() }),
  });
}

export function useTeaserLikes(teaserId, { enabled = false } = {}) {
  return useInfiniteQuery({
    queryKey: teaserKeys.likes(teaserId),
    queryFn: ({ pageParam }) =>
      getTeaserLikes({
        teaserId,
        cursorUserId: pageParam?.userId,
        cursorCreatedAt: pageParam?.createdAt,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!teaserId && enabled,
  });
}

export function useDeleteTeaser(teaserId) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => deleteTeaser(teaserId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: teaserKeys.detail(teaserId) });
      queryClient.invalidateQueries({ queryKey: teaserKeys.userTeasers("me") });
      navigate(-1);
    },
  });
}

export function useChangeTeaserVisibility(teaserId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (visibility) => changeTeaserVisibility(teaserId, visibility),
    onSuccess: (_, visibility) => {
      queryClient.setQueryData(teaserKeys.detail(teaserId), (old) =>
        old ? { ...old, visibility } : old,
      );
      queryClient.invalidateQueries({ queryKey: teaserKeys.userTeasers("me") });
    },
  });
}

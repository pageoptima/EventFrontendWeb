import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getTeaser,
  toggleTeaserLike,
  getTeaserLikes,
  deleteTeaser,
  changeTeaserVisibility,
} from "@/features/teaser/services/teaserService";
import { teaserKeys } from "@/features/teaser/teaserQueryKeys";

export function useTeaser(teaserId) {
  return useQuery({
    queryKey: teaserKeys.detail(teaserId),
    queryFn: () => getTeaser(teaserId),
    enabled: !!teaserId,
    staleTime: 45 * 60 * 1000,
  });
}

export function useToggleTeaserLike(teaserId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => toggleTeaserLike(teaserId),
    onMutate: async () => {
      // Cancel in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: teaserKeys.detail(teaserId) });

      // Snapshot current state for rollback
      const previous = queryClient.getQueryData(teaserKeys.detail(teaserId));

      // Immediately flip the UI
      queryClient.setQueryData(teaserKeys.detail(teaserId), (old) => {
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
        queryClient.setQueryData(teaserKeys.detail(teaserId), context.previous);
      }
    },
    onSuccess: (data) => {
      // Sync with server truth (corrects any count discrepancy)
      queryClient.setQueryData(teaserKeys.detail(teaserId), (old) =>
        old ? { ...old, likeCount: data.likeCount, likedByMe: data.liked } : old,
      );
    },
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

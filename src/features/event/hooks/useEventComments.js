import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEventComments,
  createEventComment,
  toggleCommentLike,
} from "@/features/event/services/eventService";
import { eventKeys } from "@/features/event/eventQueryKeys";

export function useEventComments(eventId) {
  return useInfiniteQuery({
    queryKey: eventKeys.comments(eventId),
    queryFn: ({ pageParam }) => getEventComments({ eventId, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!eventId,
  });
}

export function useCreateComment(eventId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentId }) => createEventComment({ eventId, content, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.comments(eventId) });
      queryClient.setQueryData(eventKeys.detail(eventId), (old) =>
        old ? { ...old, commentCount: (old.commentCount ?? 0) + 1 } : old,
      );
    },
  });
}

export function useToggleCommentLike(eventId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => toggleCommentLike(commentId),
    onSuccess: (data, commentId) => {
      queryClient.setQueryData(eventKeys.comments(eventId), (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c.id === commentId) {
                return { ...c, likedByMe: data.liked, likeCount: data.likeCount };
              }
              return {
                ...c,
                replies: c.replies?.map((r) =>
                  r.id === commentId
                    ? { ...r, likedByMe: data.liked, likeCount: data.likeCount }
                    : r,
                ),
              };
            }),
          })),
        };
      });
    },
  });
}

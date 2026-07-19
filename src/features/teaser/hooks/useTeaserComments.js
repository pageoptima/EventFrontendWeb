import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeaserComments,
  createTeaserComment,
  toggleTeaserCommentLike,
} from "@/features/teaser/services/teaserService";
import { teaserKeys } from "@/features/teaser/teaserQueryKeys";

export function useTeaserComments(teaserId) {
  return useInfiniteQuery({
    queryKey: teaserKeys.comments(teaserId),
    queryFn: ({ pageParam }) => getTeaserComments({ teaserId, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!teaserId,
  });
}

export function useCreateTeaserComment(teaserId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentId }) => createTeaserComment({ teaserId, content, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teaserKeys.comments(teaserId) });
      queryClient.setQueryData(teaserKeys.detail(teaserId), (old) =>
        old ? { ...old, commentCount: (old.commentCount ?? 0) + 1 } : old,
      );
    },
  });
}

export function useToggleTeaserCommentLike(teaserId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => toggleTeaserCommentLike(commentId),
    onSuccess: (data, commentId) => {
      queryClient.setQueryData(teaserKeys.comments(teaserId), (old) => {
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

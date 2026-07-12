import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostComments,
  createPostComment,
  toggleCommentLike,
} from "@/features/post/services/postService";
import { postKeys } from "@/features/post/queryKeys";

export function usePostComments(postId) {
  return useInfiniteQuery({
    queryKey: postKeys.comments(postId),
    queryFn: ({ pageParam }) => getPostComments({ postId, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!postId,
  });
}

export function useCreateComment(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content, parentId }) => createPostComment({ postId, content, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.comments(postId) });
      queryClient.setQueryData(postKeys.detail(postId), (old) =>
        old ? { ...old, commentCount: (old.commentCount ?? 0) + 1 } : old,
      );
    },
  });
}

export function useToggleCommentLike(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId) => toggleCommentLike(commentId),
    onSuccess: (data, commentId) => {
      queryClient.setQueryData(postKeys.comments(postId), (old) => {
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

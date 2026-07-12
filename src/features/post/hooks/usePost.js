import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  getPost,
  togglePostLike,
  deletePost,
  changePostVisibility,
} from "@/features/post/services/postService";
import { postKeys } from "@/features/post/queryKeys";

export function usePost(postId) {
  return useQuery({
    queryKey: postKeys.detail(postId),
    queryFn: () => getPost(postId),
    enabled: !!postId,
    staleTime: 45 * 60 * 1000,
  });
}

export function useTogglePostLike(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => togglePostLike(postId),
    onMutate: async () => {
      // Cancel in-flight refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

      // Snapshot current state for rollback
      const previous = queryClient.getQueryData(postKeys.detail(postId));

      // Immediately flip the UI
      queryClient.setQueryData(postKeys.detail(postId), (old) => {
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
        queryClient.setQueryData(postKeys.detail(postId), context.previous);
      }
    },
    onSuccess: (data) => {
      // Sync with server truth (corrects any count discrepancy)
      queryClient.setQueryData(postKeys.detail(postId), (old) =>
        old ? { ...old, likeCount: data.likeCount, likedByMe: data.liked } : old,
      );
    },
  });
}

export function useDeletePost(postId) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts("me") });
      navigate(-1);
    },
  });
}

export function useChangePostVisibility(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (visibility) => changePostVisibility(postId, visibility),
    onSuccess: (_, visibility) => {
      queryClient.setQueryData(postKeys.detail(postId), (old) =>
        old ? { ...old, visibility } : old,
      );
      queryClient.invalidateQueries({ queryKey: postKeys.userPosts("me") });
    },
  });
}

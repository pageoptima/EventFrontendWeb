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
    onSuccess: (data) => {
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

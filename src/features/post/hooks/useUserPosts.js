import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserPosts } from "@/features/post/services/postService";
import { postKeys } from "@/features/post/queryKeys";

export function useUserPosts(userId) {
  return useInfiniteQuery({
    queryKey: postKeys.userPosts(userId),
    queryFn: ({ pageParam }) => getUserPosts({ userId, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined,
    enabled: !!userId,
    staleTime: 45 * 60 * 1000,
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/features/profile/queryKeys";
import {
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriendRequest,
  removeFriend,
  blockUser,
  unblockUser,
} from "@/features/friend/services/friendService";

export function useFriendActions(targetUserId) {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: profileKeys.user(targetUserId) });

  const sendRequest = useMutation({
    mutationFn: () => sendFriendRequest(targetUserId),
    onSuccess: invalidate,
  });

  const acceptRequest = useMutation({
    mutationFn: (requestId) => acceptFriendRequest(requestId),
    onSuccess: invalidate,
  });

  const deleteRequest = useMutation({
    mutationFn: (requestId) => deleteFriendRequest(requestId),
    onSuccess: invalidate,
  });

  const unfriend = useMutation({
    mutationFn: () => removeFriend(targetUserId),
    onSuccess: invalidate,
  });

  const block = useMutation({
    mutationFn: () => blockUser(targetUserId),
    onSuccess: invalidate,
  });

  const unblock = useMutation({
    mutationFn: () => unblockUser(targetUserId),
    onSuccess: invalidate,
  });

  const isPending =
    sendRequest.isPending ||
    acceptRequest.isPending ||
    deleteRequest.isPending ||
    unfriend.isPending ||
    block.isPending ||
    unblock.isPending;

  return {
    sendRequest: () => sendRequest.mutate(),
    acceptRequest: (requestId) => acceptRequest.mutate(requestId),
    deleteRequest: (requestId) => deleteRequest.mutate(requestId),
    unfriend: () => unfriend.mutate(),
    block: () => block.mutate(),
    unblock: () => unblock.mutate(),
    isPending,
  };
}

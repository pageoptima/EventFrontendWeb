import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/features/profile/queryKeys";
import { friendKeys } from "@/features/friend/queryKeys";
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

  const invalidate = (...keys) =>
    Promise.all(keys.map((key) => queryClient.invalidateQueries({ queryKey: key })));

  const sendRequest = useMutation({
    mutationFn: () => sendFriendRequest(targetUserId),
    onSuccess: () => invalidate(
      profileKeys.user(targetUserId),
      friendKeys.outgoingRequests(),
    ),
  });

  const acceptRequest = useMutation({
    mutationFn: (requestId) => acceptFriendRequest(requestId),
    onSuccess: () => invalidate(
      profileKeys.user(targetUserId),
      profileKeys.me(),
      friendKeys.incomingRequests(),
      friendKeys.myFriends(),
    ),
  });

  const deleteRequest = useMutation({
    mutationFn: (requestId) => deleteFriendRequest(requestId),
    onSuccess: () => invalidate(
      profileKeys.user(targetUserId),
      friendKeys.incomingRequests(),
      friendKeys.outgoingRequests(),
    ),
  });

  const unfriend = useMutation({
    mutationFn: () => removeFriend(targetUserId),
    onSuccess: () => invalidate(
      profileKeys.user(targetUserId),
      profileKeys.me(),
      friendKeys.myFriends(),
    ),
  });

  const block = useMutation({
    mutationFn: () => blockUser(targetUserId),
    onSuccess: () => invalidate(
      profileKeys.user(targetUserId),
      profileKeys.me(),
      friendKeys.myFriends(),
      friendKeys.blocklist(),
    ),
  });

  const unblock = useMutation({
    mutationFn: () => unblockUser(targetUserId),
    onSuccess: () => invalidate(
      profileKeys.user(targetUserId),
      friendKeys.blocklist(),
    ),
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

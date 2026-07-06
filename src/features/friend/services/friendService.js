import api from "@/shared/utils/apis";

export const sendFriendRequest = (receiverId) =>
  api.post("/friend/request", { receiverId }).then((r) => r.data);

export const acceptFriendRequest = (requestId) =>
  api.post("/friend/request/accept", { requestId }).then((r) => r.data);

export const deleteFriendRequest = (requestId) =>
  api.post("/friend/request/delete", { requestId }).then((r) => r.data);

export const removeFriend = (friendId) =>
  api.post("/friend/delete", { friendId }).then((r) => r.data);

export const blockUser = (blockedId) =>
  api.post("/friend/block", { blockedId }).then((r) => r.data);

export const unblockUser = (blockedId) =>
  api.post("/friend/unblock", { blockedId }).then((r) => r.data);

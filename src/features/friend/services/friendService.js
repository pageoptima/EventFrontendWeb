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

export const getMyFriends = () =>
  api.get("/friend/friendlist").then((r) => r.data);

export const getUserFriends = (userId) =>
  api.get(`/friend/user/${userId}/friendlist`).then((r) => r.data);

export const getIncomingRequests = () =>
  api.get("/friend/request/incoming").then((r) => r.data);

export const getOutgoingRequests = () =>
  api.get("/friend/request/outgoing").then((r) => r.data);

export const getBlockedUsers = () =>
  api.get("/friend/blocklist").then((r) => r.data);

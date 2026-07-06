export const friendKeys = {
  all: ["friend"],
  myFriends: () => [...friendKeys.all, "myFriends"],
  userFriends: (userId) => [...friendKeys.all, "userFriends", userId],
  incomingRequests: () => [...friendKeys.all, "incomingRequests"],
  outgoingRequests: () => [...friendKeys.all, "outgoingRequests"],
  blocklist: () => [...friendKeys.all, "blocklist"],
};

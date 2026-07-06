import { useQuery } from "@tanstack/react-query";
import { friendKeys } from "@/features/friend/queryKeys";
import {
  getMyFriends,
  getUserFriends,
  getIncomingRequests,
  getOutgoingRequests,
  getBlockedUsers,
} from "@/features/friend/services/friendService";

export function useMyFriends(options = {}) {
  return useQuery({
    queryKey: friendKeys.myFriends(),
    queryFn: getMyFriends,
    ...options,
  });
}

export function useUserFriends(userId, options = {}) {
  return useQuery({
    queryKey: friendKeys.userFriends(userId),
    queryFn: () => getUserFriends(userId),
    enabled: Boolean(userId),
    ...options,
  });
}

export function useIncomingRequests(options = {}) {
  return useQuery({
    queryKey: friendKeys.incomingRequests(),
    queryFn: getIncomingRequests,
    ...options,
  });
}

export function useOutgoingRequests(options = {}) {
  return useQuery({
    queryKey: friendKeys.outgoingRequests(),
    queryFn: getOutgoingRequests,
    ...options,
  });
}

export function useBlockedUsers(options = {}) {
  return useQuery({
    queryKey: friendKeys.blocklist(),
    queryFn: getBlockedUsers,
    ...options,
  });
}

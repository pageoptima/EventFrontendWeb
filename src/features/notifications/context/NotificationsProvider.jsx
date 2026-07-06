import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import NotificationsContext from "@/features/notifications/context/NotificationsContext";
import { useIncomingRequests } from "@/features/friend/hooks/useFriendQueries";

function NotificationsProvider({ children }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const toggleNotifications = useCallback(
    () => setIsNotificationsOpen((prev) => !prev),
    [],
  );

  const isAuthenticated = useSelector((state) => Boolean(state.auth.accessToken));

  const { data: friendRequests = [], isLoading } = useIncomingRequests({
    enabled: isAuthenticated,
  });

  // Generic notifications array — add new sources here as features are built
  // (e.g. post likes, comments, mentions)
  const notifications = useMemo(
    () =>
      friendRequests.map((req) => ({
        id: req.id,
        type: "friend_request",
        createdAt: req.createdAt,
        data: req,
      })),
    [friendRequests],
  );

  const value = useMemo(
    () => ({
      isNotificationsOpen,
      toggleNotifications,
      notifications,
      notificationCount: notifications.length,
      isLoading,
    }),
    [isNotificationsOpen, toggleNotifications, notifications, isLoading],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsProvider;

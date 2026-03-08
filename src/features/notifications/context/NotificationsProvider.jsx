import { useCallback, useMemo, useState } from "react";
import NotificationsContext from "@/features/notifications/context/NotificationsContext";

function NotificationsProvider({ children }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const toggleNotifications = useCallback(
    () => setIsNotificationsOpen((prev) => !prev),
    [],
  );

  const value = useMemo(
    () => ({
      isNotificationsOpen,
      toggleNotifications,
    }),
    [isNotificationsOpen, toggleNotifications],
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export default NotificationsProvider;

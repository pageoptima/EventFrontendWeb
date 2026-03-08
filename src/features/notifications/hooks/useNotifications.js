import { useContext } from "react";
import NotificationsContext from "@/features/notifications/context/NotificationsContext";

function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }

  return context;
}

export default useNotifications;

import { useEffect } from "react";
import { createPortal } from "react-dom";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import useNotifications from "@/features/notifications/useNotifications";

function NotificationsLayer() {
  const { isNotificationsOpen, toggleNotifications } = useNotifications();

  useEffect(() => {
    if (!isNotificationsOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !event.repeat) {
        toggleNotifications();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNotificationsOpen, toggleNotifications]);

  if (!isNotificationsOpen) {
    return null;
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-20 bg-transparent"
        onMouseDown={toggleNotifications}
        aria-hidden="true"
      />
      <NotificationsPanel id="notifications-panel" />
    </>,
    document.body,
  );
}

export default NotificationsLayer;

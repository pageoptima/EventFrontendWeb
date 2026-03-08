import NotificationsProvider from "@/features/notifications/NotificationsProvider";

export function AppProviders({ children }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}


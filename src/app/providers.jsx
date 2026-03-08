import { NotificationsProvider } from "@/features/notifications";

export function AppProviders({ children }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}

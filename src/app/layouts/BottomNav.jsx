import { NavLink } from "react-router-dom";
import { Bell, Home, MessageCircle, Play, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/features/notifications";

const navItems = [
  { label: "Home", to: "/", Icon: Home },
  { label: "Search", to: "/search", Icon: Search },
  { label: "Teaser", to: "/teaser", Icon: Play },
  { label: "Chats", to: "/chats", Icon: MessageCircle },
  { label: "Notifications", to: "/notifications", Icon: Bell },
  { label: "Profile", to: "/profile", Icon: User },
];

const itemClass = (isActive) =>
  cn(
    "flex flex-col items-center justify-center gap-1 flex-1 py-2 min-w-0 transition-colors",
    isActive ? "text-[#B839F1]" : "text-slate-400 hover:text-slate-600",
  );

function BottomNav() {
  const { isNotificationsOpen, toggleNotifications } = useNotifications();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex items-center border-t border-border bg-white/95 backdrop-blur-sm md:hidden"
      aria-label="Mobile navigation"
    >
      {navItems.map((item) =>
        item.to === "/notifications" ? (
          <button
            key="notifications"
            type="button"
            onClick={toggleNotifications}
            aria-label="Notifications"
            aria-expanded={isNotificationsOpen}
            aria-controls="notifications-panel"
            className={itemClass(isNotificationsOpen)}
          >
            <item.Icon className="h-6 w-6" strokeWidth={1.8} />
          </button>
        ) : (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            aria-label={item.label}
            className={({ isActive }) => itemClass(isActive)}
          >
            {({ isActive }) => (
              <item.Icon
                className="h-6 w-6"
                strokeWidth={isActive ? 2.2 : 1.8}
              />
            )}
          </NavLink>
        ),
      )}
    </nav>
  );
}

export default BottomNav;

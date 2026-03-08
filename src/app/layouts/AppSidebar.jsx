import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import eventIcon from "@/assets/icons/event.svg";
import plusIcon from "@/assets/icons/plus-black.svg";
import AppButton from "@/shared/components/common/AppButton";
import { sidebarMainItems } from "@/app/config/sidebar";
import { useNotifications } from "@/features/notifications";

const settingsItem = sidebarMainItems.find((item) => item.to === "/settings");
const primaryItems = sidebarMainItems.filter((item) => item.to !== "/settings");

function AppSidebar() {
  const { isNotificationsOpen, toggleNotifications } = useNotifications();
  const closeNotificationsIfOpen = () => {
    if (isNotificationsOpen) {
      toggleNotifications();
    }
  };

  const getNavItemClassName = (isActive) =>
    cn(
      "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-[linear-gradient(90deg,#B839F1_0%,#2A104F00_100%)] text-white"
        : "text-white/80 hover:text-white hover:bg-white/10",
    );

  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 shrink-0 overflow-y-auto text-white bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)]">
      <div className="px-6 py-6 text-lg font-semibold flex items-center gap-3">
        <img src={eventIcon} alt="" className="h-8 w-8" />
        <span>Event</span>
      </div>
      <nav className="px-4 pb-4 mt-4 space-y-1">
        {primaryItems.map((item) =>
          item.to === "/notifications" ? (
            <button
              key={item.to}
              type="button"
              onClick={toggleNotifications}
              className={getNavItemClassName(isNotificationsOpen)}
              aria-expanded={isNotificationsOpen}
              aria-controls="notifications-panel"
            >
              <img src={item.icon} alt="" className="h-4 w-4" />
              <span>{item.label}</span>
            </button>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeNotificationsIfOpen}
              className={({ isActive }) => getNavItemClassName(isActive)}
            >
              <img src={item.icon} alt="" className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ),
        )}
        <div className="py-2">
          <AppButton
            asChild
            leftIcon={plusIcon}
            iconClassName="brightness-0 invert"
            className="h-10 w-[175px] max-w-full justify-start rounded-full bg-[linear-gradient(90deg,#B839F1_0%,#FF2727_100%)] px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
          >
            <NavLink to="/create-event" onClick={closeNotificationsIfOpen}>
              Create an Event
            </NavLink>
          </AppButton>
        </div>
        {settingsItem ? (
          <NavLink
            to={settingsItem.to}
            onClick={closeNotificationsIfOpen}
            className={({ isActive }) => getNavItemClassName(isActive)}
          >
            <img src={settingsItem.icon} alt="" className="h-4 w-4" />
            <span>{settingsItem.label}</span>
          </NavLink>
        ) : null}
      </nav>
      <div className="pb-8" />
    </aside>
  );
}

export default AppSidebar;

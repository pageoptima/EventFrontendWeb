import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import eventIcon from "@/assets/icons/event.svg";
import plusIcon from "@/assets/icons/plus-black.svg";
import { sidebarMainItems } from "@/app/config/sidebar";
import { useNotifications } from "@/features/notifications";

const settingsItem = sidebarMainItems.find((item) => item.to === "/settings");
const primaryItems = sidebarMainItems.filter((item) => item.to !== "/settings");

const navItemClass = (isActive) =>
  cn(
    "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-medium transition-colors",
    "md:justify-center md:px-2 lg:justify-start lg:px-3",
    isActive
      ? "bg-[linear-gradient(90deg,#B839F1_0%,#2A104F00_100%)] text-white"
      : "text-white/80 hover:text-white hover:bg-white/10",
  );

function AppSidebar() {
  const { isNotificationsOpen, toggleNotifications, notificationCount } = useNotifications();

  const closeNotificationsIfOpen = () => {
    if (isNotificationsOpen) toggleNotifications();
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-screen shrink-0 overflow-y-auto text-white",
        "bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)]",
        // Hidden on mobile, icon-only on tablet, full on desktop
        "hidden md:flex md:w-16 lg:w-64 flex-col",
      )}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-3 py-6 lg:px-6">
        <img src={eventIcon} alt="Event" className="h-8 w-8 shrink-0" />
        <span className="hidden lg:block text-lg font-semibold">Event</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-1 px-2 pb-4 lg:px-4" aria-label="App navigation">
        {primaryItems.map((item) =>
          item.to === "/notifications" ? (
            <button
              key={item.to}
              type="button"
              onClick={toggleNotifications}
              className={navItemClass(isNotificationsOpen)}
              aria-expanded={isNotificationsOpen}
              aria-controls="notifications-panel"
              title={item.label}
            >
              <div className="relative shrink-0">
                <img src={item.icon} alt="" className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2F3B] text-[9px] font-bold text-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={closeNotificationsIfOpen}
              className={({ isActive }) => navItemClass(isActive)}
              title={item.label}
            >
              <img src={item.icon} alt="" className="h-5 w-5 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          ),
        )}

        {/* Create Event — icon-only on tablet, full button on desktop */}
        <div className="py-2">
          <div className="lg:hidden flex justify-center">
            <NavLink
              to="/create-event"
              onClick={closeNotificationsIfOpen}
              title="Create an Event"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient-h text-white shadow-sm transition hover:opacity-90"
            >
              <img
                src={plusIcon}
                alt="Create an Event"
                className="h-5 w-5 brightness-0 invert"
              />
            </NavLink>
          </div>
          <div className="hidden lg:block">
            <NavLink
              to="/create-event"
              onClick={closeNotificationsIfOpen}
              className="inline-flex h-10 w-43.75 max-w-full items-center gap-2 justify-start rounded-full bg-brand-gradient-h px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              <img
                src={plusIcon}
                alt=""
                className="h-4 w-4 brightness-0 invert"
              />
              Create an Event
            </NavLink>
          </div>
        </div>

        {settingsItem ? (
          <NavLink
            to={settingsItem.to}
            onClick={closeNotificationsIfOpen}
            className={({ isActive }) => navItemClass(isActive)}
            title={settingsItem.label}
          >
            <img src={settingsItem.icon} alt="" className="h-5 w-5 shrink-0" />
            <span className="hidden lg:block">{settingsItem.label}</span>
          </NavLink>
        ) : null}
      </nav>

      <div className="pb-8" />
    </aside>
  );
}

export default AppSidebar;

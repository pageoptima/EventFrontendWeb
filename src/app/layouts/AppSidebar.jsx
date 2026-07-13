import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NavLink, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import eventIcon from "@/assets/icons/event.svg";
import plusIcon from "@/assets/icons/plus-black.svg";
import { Clapperboard, CalendarPlus } from "lucide-react";
import { sidebarMainItems } from "@/app/config/sidebar";
import { useNotifications } from "@/features/notifications";

const CREATE_OPTIONS = [
  { label: "Event", Icon: CalendarPlus, to: "/create-event" },
  { label: "Teaser", Icon: Clapperboard, to: "/create-teaser" },
];

function CreateMenu({ onClose }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [popupStyle, setPopupStyle] = useState({});
  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      const inTrigger = triggerRef.current?.contains(e.target);
      const inPopup = popupRef.current?.contains(e.target);
      if (!inTrigger && !inPopup) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function handleToggle() {
    if (!open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isTablet = window.innerWidth < 1024;
      if (isTablet) {
        setPopupStyle({ top: rect.top, left: rect.right + 12 });
      } else {
        setPopupStyle({ bottom: window.innerHeight - rect.top + 8, left: rect.left });
      }
    }
    setOpen((v) => !v);
  }

  function handleSelect(to) {
    setOpen(false);
    onClose?.();
    navigate(to);
  }

  return (
    <div className="py-2">
      {open &&
        createPortal(
          <div
            ref={popupRef}
            style={{ position: "fixed", zIndex: 9999, ...popupStyle }}
            className="min-w-52.5 rounded-2xl border border-white/20 bg-[#2A1060] dark:bg-[#1E1A38] p-3 shadow-2xl"
          >
            <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-white/50 dark:text-[#9C96B8]">
              Create
            </p>
            <div className="flex items-start justify-around gap-1">
              {CREATE_OPTIONS.map(({ label, Icon, to }) => (
                <button
                  key={to}
                  type="button"
                  onClick={() => handleSelect(to)}
                  className="flex flex-col items-center gap-1.5 rounded-xl p-2 transition hover:bg-white/10 dark:hover:bg-white/5"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#B839F1,#2A104F)] dark:bg-[linear-gradient(135deg,#555FD7,#2CB8E8)] text-white shadow">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-medium text-white dark:text-[#F4F2FA]">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}

      <div ref={triggerRef}>
        <div className="flex justify-center lg:hidden">
          <button
            type="button"
            onClick={handleToggle}
            title="Create"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient-h text-white shadow-sm transition hover:opacity-90"
          >
            <img src={plusIcon} alt="Create" className="h-5 w-5 brightness-0 invert" />
          </button>
        </div>

        <div className="hidden lg:block">
          <button
            type="button"
            onClick={handleToggle}
            className="inline-flex h-10 w-full items-center justify-start gap-2 rounded-full px-4 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 dark:rounded-2xl bg-brand-gradient-h"
          >
            <img src={plusIcon} alt="" className="h-4 w-4 brightness-0 invert" />
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

const settingsItem = sidebarMainItems.find((item) => item.to === "/settings");
const primaryItems = sidebarMainItems.filter((item) => item.to !== "/settings");

const navItemClass = (isActive) =>
  cn(
    "flex items-center gap-3 rounded-full dark:rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors",
    "md:justify-center md:px-2 lg:justify-start lg:px-3",
    isActive
      ? "bg-[linear-gradient(90deg,#B839F1_0%,#2A104F00_100%)] dark:bg-[linear-gradient(90deg,rgba(85,95,215,0.35)_0%,rgba(44,184,232,0.05)_100%)] text-white"
      : "text-white/80 dark:text-[#9C96B8] hover:text-white dark:hover:text-[#F4F2FA] hover:bg-white/10 dark:hover:bg-white/5",
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
        "bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)] dark:bg-[linear-gradient(180deg,#16132E_0%,#060410_100%)]",
        "hidden md:flex md:w-16 lg:w-64 flex-col",
      )}
      aria-label="Main navigation"
    >
      <div className="flex items-center gap-3 px-3 py-6 lg:px-6">
        <img src={eventIcon} alt="Event" className="h-8 w-8 shrink-0" />
        <span className="hidden lg:block text-lg font-semibold">Event</span>
      </div>

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

        <CreateMenu onClose={closeNotificationsIfOpen} />

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

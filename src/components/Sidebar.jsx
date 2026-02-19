import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import eventIcon from "@/assets/icons/event.svg";
import plusIcon from "@/assets/icons/plus-black.svg";
import AppButton from "@/components/AppButton";
import { sidebarMainItems } from "@/config/sidebar";

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 text-white bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)]">
      <div className="px-6 py-6 text-lg font-semibold flex items-center gap-3">
        <img src={eventIcon} alt="" className="h-8 w-8" />
        <span>Event</span>
      </div>
      <nav className="px-4 pb-4 mt-4 space-y-1">
        {sidebarMainItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[linear-gradient(90deg,#B839F1_0%,#2A104F00_100%)] text-white"
                  : "text-white/80 hover:text-white hover:bg-white/10",
              )
            }
          >
            <img src={item.icon} alt="" className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="px-4 pb-6">
        <AppButton
          asChild
          leftIcon={plusIcon}
          iconClassName="brightness-0 invert"
          className="rounded-full bg-[linear-gradient(90deg,#B839F1_0%,#FF2727_100%)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <NavLink to="/create-event">Create an Event</NavLink>
        </AppButton>
      </div>
      <div className="pb-8" />
    </aside>
  );
}

export default Sidebar;

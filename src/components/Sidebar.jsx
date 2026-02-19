import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Search", to: "/search" },
  { label: "Teaser", to: "/teaser" },
  { label: "Chats", to: "/chats" },
  { label: "Notifications", to: "/notifications" },
  { label: "Profile", to: "/profile" },
  { label: "Create an Event", to: "/create-event" },
  { label: "Settings", to: "/settings" },
];

function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="px-6 py-6 text-lg font-semibold">Event</div>
      <nav className="px-4 pb-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:text-sidebar-foreground"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

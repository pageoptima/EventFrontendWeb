import { cn } from "@/lib/utils";
import { notifications as notificationsData } from "@/app/config/notifications";
import { profiles } from "@/app/config/profiles";

const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

function NotificationItem({ notification }) {
  const actor = profilesById.get(notification.actorId);
  const username = actor?.username ?? notification.actorId ?? "user_id";
  const avatarSrc = actor?.image ?? "";

  return (
    <li
      className={cn(
        "relative rounded-2xl px-4 py-3 transition",
        notification.highlighted ? "bg-white text-slate-900" : "text-white",
      )}
    >
      {notification.unread ? (
        <span
          className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-[#FF2F3B]"
          aria-label="Unread notification"
        />
      ) : null}

      <div className="flex items-center gap-3">
        <img
          src={avatarSrc}
          alt={username}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <p className="text-[13px] leading-4">
            <span className="font-medium">{username}</span>{" "}
            <span>{notification.message}</span>
          </p>
        </div>

        <button
          type="button"
          className={cn(
            "shrink-0 text-sm font-semibold",
            notification.highlighted ? "text-[#0B6CFF]" : "text-white",
          )}
        >
          {notification.actionLabel}
        </button>
      </div>
    </li>
  );
}

function NotificationsPanel({ id, className }) {
  return (
    <aside
      id={id}
      className={cn(
        "fixed z-40 rounded-2xl bg-[linear-gradient(180deg,#071757_0%,#03020D_100%)] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
        // Mobile: above the bottom nav, full width with side margins
        "bottom-20 inset-x-3",
        // Tablet: next to icon sidebar (64px = md:left-16), anchor below header
        "md:bottom-auto md:inset-x-auto md:left-20 md:top-28 md:w-[345px]",
        // Desktop: original pop-out from sidebar position
        "lg:left-[9.75rem] lg:top-44",
        className,
      )}
      role="dialog"
      aria-label="Notifications"
      aria-modal="false"
    >
      <ul className="space-y-3">
        {notificationsData.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </aside>
  );
}

export default NotificationsPanel;

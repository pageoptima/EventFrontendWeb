import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useNotifications from "@/features/notifications/hooks/useNotifications";
import { friendKeys } from "@/features/friend/queryKeys";
import { profileKeys } from "@/features/profile/queryKeys";
import { acceptFriendRequest, deleteFriendRequest } from "@/features/friend/services/friendService";

function UserAvatar({ name, profilePicture }) {
  if (profilePicture) {
    return (
      <img
        src={profilePicture}
        alt={name}
        className="h-9 w-9 shrink-0 rounded-full object-cover"
        loading="lazy"
      />
    );
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
      {name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

function FriendRequestItem({ request }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: friendKeys.incomingRequests() }),
      queryClient.invalidateQueries({ queryKey: friendKeys.myFriends() }),
      queryClient.invalidateQueries({ queryKey: profileKeys.me() }),
    ]);

  const accept = useMutation({
    mutationFn: () => acceptFriendRequest(request.id),
    onSuccess: invalidate,
  });

  const decline = useMutation({
    mutationFn: () => deleteFriendRequest(request.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.incomingRequests() }),
  });

  const isPending = accept.isPending || decline.isPending;

  return (
    <li className="rounded-2xl px-3 py-2.5 text-white">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/profile/${request.sender.id}`)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <UserAvatar name={request.sender.name} profilePicture={request.sender.profilePicture} />
          <p className="text-[13px] leading-4">
            <span className="font-medium">{request.sender.name}</span>{" "}
            <span className="text-white/70">sent you a friend request.</span>
          </p>
        </button>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decline.mutate()}
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white transition hover:bg-white/20 disabled:opacity-60"
          >
            {decline.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Decline"}
          </button>
          <button
            type="button"
            onClick={() => accept.mutate()}
            disabled={isPending}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-900 transition hover:bg-white/90 disabled:opacity-60"
          >
            {accept.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Accept"}
          </button>
        </div>
      </div>
    </li>
  );
}

function renderNotification(notification) {
  switch (notification.type) {
    case "friend_request":
      return <FriendRequestItem key={notification.id} request={notification.data} />;
    default:
      return null;
  }
}

function NotificationsPanel({ id, className }) {
  const { notifications, isLoading } = useNotifications();

  return (
    <aside
      id={id}
      className={cn(
        "fixed z-40 rounded-2xl bg-[linear-gradient(180deg,#071757_0%,#03020D_100%)] p-3 shadow-[0_24px_60px_rgba(0,0,0,0.5)]",
        "bottom-20 inset-x-3",
        "md:bottom-auto md:inset-x-auto md:left-20 md:top-28 md:w-86.25",
        "lg:left-39 lg:top-44",
        className,
      )}
      role="dialog"
      aria-label="Notifications"
      aria-modal="false"
    >
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-white/50">
        Notifications
      </p>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-white/50" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="px-2 py-4 text-sm text-white/50">No notifications.</p>
      ) : (
        <ul className="space-y-1">
          {notifications.map(renderNotification)}
        </ul>
      )}
    </aside>
  );
}

export default NotificationsPanel;

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Loader2, Moon, Sun } from "lucide-react";
import { clearCredentials } from "@/stores/slices/authSlice";
import { toggleTheme, selectThemeMode } from "@/stores/slices/themeSlice";
import { useBlockedUsers, useOutgoingRequests } from "@/features/friend/hooks/useFriendQueries";
import { friendKeys } from "@/features/friend/queryKeys";
import { unblockUser, deleteFriendRequest } from "@/features/friend/services/friendService";

function BlockedUserItem({ user }) {
  const queryClient = useQueryClient();

  const unblock = useMutation({
    mutationFn: () => unblockUser(user.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.blocklist() }),
  });

  return (
    <div className="flex items-center gap-3 py-2.5">
      {user.profilePicture ? (
        <img
          src={user.profilePicture}
          alt={user.name}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
          {user.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      <span className="flex-1 text-sm font-medium text-foreground">{user.name}</span>
      <button
        type="button"
        onClick={() => unblock.mutate()}
        disabled={unblock.isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
      >
        {unblock.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Unblock"}
      </button>
    </div>
  );
}

function SentRequestItem({ request }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const cancel = useMutation({
    mutationFn: () => deleteFriendRequest(request.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: friendKeys.outgoingRequests() }),
  });

  return (
    <div className="flex items-center gap-3 py-2.5">
      {request.receiver.profilePicture ? (
        <img
          src={request.receiver.profilePicture}
          alt={request.receiver.name}
          className="h-9 w-9 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white">
          {request.receiver.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate(`/profile/${request.receiver.id}`)}
        className="flex-1 text-left text-sm font-medium text-foreground hover:underline"
      >
        {request.receiver.name}
      </button>
      <button
        type="button"
        onClick={() => cancel.mutate()}
        disabled={cancel.isPending}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted disabled:opacity-60"
      >
        {cancel.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel"}
      </button>
    </div>
  );
}

function SettingsPage() {
  const dispatch = useDispatch();
  const themeMode = useSelector(selectThemeMode);
  const isDark = themeMode === "dark";
  const { data: blockedUsers = [], isLoading: blocklistLoading } = useBlockedUsers();
  const { data: outgoingRequests = [], isLoading: outgoingLoading } = useOutgoingRequests();

  const handleLogout = () => {
    dispatch(clearCredentials());
  };

  return (
    <section className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-1">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Appearance
        </p>
        <div className="flex items-center justify-between rounded-lg px-3 py-2.5">
          <div className="flex items-center gap-3">
            {isDark ? (
              <Moon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            )}
            <span className="text-sm font-medium text-foreground">Dark mode</span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            onClick={() => dispatch(toggleTheme())}
            className={[
              "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isDark ? "bg-[#7F5AF0]" : "bg-border",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
                isDark ? "translate-x-5" : "translate-x-0.5",
              ].join(" ")}
            />
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-4 space-y-1">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Account
        </p>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/10"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Friend Requests
        </p>
        <p className="mt-2 px-1 text-sm font-medium text-foreground">Sent Requests</p>

        {outgoingLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : outgoingRequests.length === 0 ? (
          <p className="mt-2 px-1 text-sm text-muted-foreground">No pending sent requests.</p>
        ) : (
          <div className="mt-2 divide-y divide-border">
            {outgoingRequests.map((req) => (
              <SentRequestItem key={req.id} request={req} />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Privacy
        </p>
        <p className="mt-2 px-1 text-sm font-medium text-foreground">Blocked Users</p>

        {blocklistLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : blockedUsers.length === 0 ? (
          <p className="mt-2 px-1 text-sm text-muted-foreground">No blocked users.</p>
        ) : (
          <div className="mt-2 divide-y divide-border">
            {blockedUsers.map((user) => (
              <BlockedUserItem key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default SettingsPage;

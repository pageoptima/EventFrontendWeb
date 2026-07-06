import { useDispatch } from "react-redux";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut, Loader2 } from "lucide-react";
import { clearCredentials } from "@/stores/slices/authSlice";
import { useBlockedUsers } from "@/features/friend/hooks/useFriendQueries";
import { friendKeys } from "@/features/friend/queryKeys";
import { unblockUser } from "@/features/friend/services/friendService";

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

function SettingsPage() {
  const dispatch = useDispatch();
  const { data: blockedUsers = [], isLoading: blocklistLoading } = useBlockedUsers();

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

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useBlockedUsers, useOutgoingRequests } from "@/features/friend/hooks/useFriendQueries";
import { friendKeys } from "@/features/friend/queryKeys";
import { unblockUser, deleteFriendRequest } from "@/features/friend/services/friendService";

function SectionList({ isLoading, items, emptyText, children }) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (items.length === 0) {
    return <p className="mt-3 text-sm text-muted-foreground">{emptyText}</p>;
  }
  return <div className="mt-2 divide-y divide-border">{children}</div>;
}

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
      <span className="flex-1 min-w-0 truncate text-sm font-medium text-foreground">
        {user.name}
      </span>
      <button
        type="button"
        onClick={() => unblock.mutate()}
        disabled={unblock.isPending}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
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
        className="flex-1 min-w-0 truncate text-left text-sm font-medium text-foreground hover:underline"
      >
        {request.receiver.name}
      </button>
      <button
        type="button"
        onClick={() => cancel.mutate()}
        disabled={cancel.isPending}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground transition hover:bg-muted disabled:opacity-60"
      >
        {cancel.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Cancel"}
      </button>
    </div>
  );
}

function PrivacyPanel() {
  const { data: blockedUsers = [], isLoading: blocklistLoading } = useBlockedUsers();
  const { data: outgoingRequests = [], isLoading: outgoingLoading } = useOutgoingRequests();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Privacy</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Manage friend requests and blocked accounts.
        </p>
      </div>

      {/* Sent friend requests */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sent Requests
        </p>

        <SectionList isLoading={outgoingLoading} items={outgoingRequests} emptyText="No pending sent requests.">
          {outgoingRequests.map((req) => (
            <SentRequestItem key={req.id} request={req} />
          ))}
        </SectionList>
      </div>

      {/* Blocked users */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Blocked Users
        </p>

        <SectionList isLoading={blocklistLoading} items={blockedUsers} emptyText="No blocked users.">
          {blockedUsers.map((user) => (
            <BlockedUserItem key={user.id} user={user} />
          ))}
        </SectionList>
      </div>
    </div>
  );
}

export default PrivacyPanel;

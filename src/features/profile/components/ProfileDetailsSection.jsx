import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Mail, MoreHorizontal, Loader2 } from "lucide-react";
import FriendsModal from "@/features/profile/components/FriendsModal";

const countFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
  maximumFractionDigits: 1,
});

function formatCount(value) {
  return countFormatter.format(value ?? 0);
}

function Avatar({ name, profilePicture, isOwn, uploading, onChangeClick }) {
  const initial = name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="absolute -bottom-10 left-4 h-21 w-21 rounded-full bg-brand-gradient p-0.5 sm:left-6 sm:h-31 sm:w-31">
      <div className="relative h-full w-full overflow-hidden rounded-full bg-white dark:bg-background p-0.5">
        {profilePicture ? (
          <img
            src={profilePicture}
            alt={name}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-brand-gradient text-2xl font-bold text-white sm:text-3xl">
            {initial}
          </div>
        )}

        {isOwn && (
          <button
            type="button"
            onClick={onChangeClick}
            disabled={uploading}
            aria-label="Change profile picture"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition hover:opacity-100 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <Camera className="h-5 w-5 text-white" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function RelationshipButton({
  relationship,
  onMessage,
  onAddFriend,
  onAcceptRequest,
  onDeleteRequest,
  isPending,
}) {
  const { isFriend, isBlocked, requestSent, requestReceived, requestId } =
    relationship ?? {};

  if (isBlocked) {
    return (
      <button
        type="button"
        disabled
        className="h-8.5 rounded-full border border-border bg-white dark:bg-card px-4 text-xs font-semibold text-destructive opacity-60 sm:h-9.5"
      >
        Blocked
      </button>
    );
  }

  if (isFriend) {
    return (
      <button
        type="button"
        onClick={onMessage}
        className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-white dark:bg-card text-slate-700 dark:text-foreground transition hover:bg-slate-50 dark:hover:bg-muted sm:h-9.75 sm:w-9.75"
        aria-label="Message"
      >
        <Mail className="h-4 w-4" />
      </button>
    );
  }

  if (requestReceived) {
    return (
      <>
        <button
          type="button"
          onClick={() => onDeleteRequest?.(requestId)}
          disabled={isPending}
          className="h-8.5 rounded-full border border-border bg-white dark:bg-card px-4 text-xs font-semibold text-muted-foreground transition hover:bg-muted disabled:opacity-60 sm:h-9.5"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => onAcceptRequest?.(requestId)}
          disabled={isPending}
          className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-brand-gradient-h px-4 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 sm:h-9.5"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            "Accept Request"
          )}
        </button>
      </>
    );
  }

  if (requestSent) {
    return (
      <button
        type="button"
        onClick={() => onDeleteRequest?.(requestId)}
        disabled={isPending}
        className="h-8.5 rounded-full border border-border bg-white dark:bg-card px-4 text-xs font-semibold text-muted-foreground transition hover:bg-muted disabled:opacity-60 sm:h-9.5"
      >
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          "Cancel Request"
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onAddFriend}
      disabled={isPending}
      className="inline-flex h-8.5 items-center gap-1.5 rounded-full bg-brand-gradient-h px-4 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60 sm:h-9.5"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        "Add Friend"
      )}
    </button>
  );
}

function MoreOptionsMenu({ isFriend, isBlocked, onUnfriend, onBlock, onUnblock, isPending }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const showUnfriend = isFriend && !isBlocked;
  const showBlock = !isBlocked;
  const showUnblock = isBlocked;
  const hasOptions = showUnfriend || showBlock || showUnblock;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => hasOptions && setOpen((v) => !v)}
        className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-white dark:bg-card text-slate-700 dark:text-foreground transition hover:bg-slate-50 dark:hover:bg-muted sm:h-9.75 sm:w-9.75"
        aria-label="More options"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && hasOptions && (
        <div className="absolute right-0 top-full z-10 mt-1.5 w-40 overflow-hidden rounded-xl border border-border bg-white dark:bg-card shadow-md">
          {showUnfriend && (
            <button
              type="button"
              onClick={() => { onUnfriend?.(); setOpen(false); }}
              disabled={isPending}
              className="flex w-full items-center px-4 py-2.5 text-sm text-foreground transition hover:bg-muted disabled:opacity-60"
            >
              Unfriend
            </button>
          )}
          {showBlock && (
            <button
              type="button"
              onClick={() => { onBlock?.(); setOpen(false); }}
              disabled={isPending}
              className="flex w-full items-center px-4 py-2.5 text-sm text-destructive transition hover:bg-destructive/10 disabled:opacity-60"
            >
              Block
            </button>
          )}
          {showUnblock && (
            <button
              type="button"
              onClick={() => { onUnblock?.(); setOpen(false); }}
              disabled={isPending}
              className="flex w-full items-center px-4 py-2.5 text-sm text-foreground transition hover:bg-muted disabled:opacity-60"
            >
              Unblock
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ProfileDetailsSection({
  profile,
  isOwn = false,
  onProfilePictureChange,
  onCoverPictureChange,
  uploadingPicture = false,
  uploadingCover = false,
  uploadError = "",
  onMessage,
  onAddFriend,
  onAcceptRequest,
  onDeleteRequest,
  onUnfriend,
  onBlock,
  onUnblock,
  friendActionPending = false,
  profileUserId,
}) {
  const navigate = useNavigate();
  const pictureInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [friendsModalOpen, setFriendsModalOpen] = useState(false);

  if (!profile) return null;

  const { name, bio, profilePicture, coverPicture, postCount, friendCount, relationship } = profile;
  const isBlockedByThem = !isOwn && Boolean(relationship?.isBlockedByThem);

  const handlePictureFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onProfilePictureChange?.(file);
    e.target.value = "";
  };

  const handleCoverFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onCoverPictureChange?.(file);
    e.target.value = "";
  };

  return (
    <>
      {/* Cover image */}
      <div className="relative h-48 sm:h-56">
        {coverPicture ? (
          <img
            src={coverPicture}
            alt={`${name} cover`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)]" />
        )}
        <div className="absolute inset-0 bg-black/20" />

        {isOwn && (
          <>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              aria-label="Change cover picture"
              className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg bg-black/50 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-black/70 disabled:cursor-not-allowed"
            >
              {uploadingCover ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
              Edit cover
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleCoverFile}
            />
          </>
        )}

        <Avatar
          name={name}
          profilePicture={profilePicture}
          isOwn={isOwn}
          uploading={uploadingPicture}
          onChangeClick={() => pictureInputRef.current?.click()}
        />

        {isOwn && (
          <input
            ref={pictureInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handlePictureFile}
          />
        )}
      </div>

      {/* Profile body */}
      <div className="space-y-5 px-4 pb-5 pt-12 sm:px-6 sm:pb-6 sm:pt-21">
        {uploadError && (
          <p className="text-xs text-destructive">{uploadError}</p>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-3xl font-semibold leading-none text-foreground">
            {name}
          </h1>

          <div className="flex items-center gap-2">
            {isOwn ? (
              <button
                type="button"
                onClick={() => navigate("/settings")}
                className="h-8.5 rounded-full border border-border bg-white dark:bg-card px-4 text-xs font-semibold text-foreground transition hover:bg-muted sm:h-9.5"
              >
                Edit Profile
              </button>
            ) : !isBlockedByThem ? (
              <>
                <MoreOptionsMenu
                  isFriend={relationship?.isFriend}
                  isBlocked={relationship?.isBlocked}
                  onUnfriend={onUnfriend}
                  onBlock={onBlock}
                  onUnblock={onUnblock}
                  isPending={friendActionPending}
                />
                <RelationshipButton
                  relationship={relationship}
                  onMessage={onMessage}
                  onAddFriend={onAddFriend}
                  onAcceptRequest={onAcceptRequest}
                  onDeleteRequest={onDeleteRequest}
                  isPending={friendActionPending}
                />
              </>
            ) : null}
          </div>
        </div>

        {bio && (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {bio}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-x-7 gap-y-1 text-sm">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatCount(postCount)}
            </span>{" "}
            Posts
          </p>
          <button
            type="button"
            onClick={() => setFriendsModalOpen(true)}
            className="text-muted-foreground transition hover:text-foreground"
          >
            <span className="font-semibold text-foreground">
              {formatCount(friendCount)}
            </span>{" "}
            Friends
          </button>
        </div>
      </div>

      {friendsModalOpen && (
        <FriendsModal
          isOwn={isOwn}
          profileUserId={profileUserId}
          onClose={() => setFriendsModalOpen(false)}
        />
      )}
    </>
  );
}

export default ProfileDetailsSection;

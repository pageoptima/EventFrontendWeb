import { useRef } from "react";
import { Camera, Mail, MoreHorizontal, Loader2 } from "lucide-react";

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
      <div className="relative h-full w-full overflow-hidden rounded-full bg-white p-0.5">
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

function RelationshipButton({ relationship, onMessage }) {
  const { isFriend, isBlocked, requestSent, requestReceived } = relationship ?? {};

  if (isBlocked) {
    return (
      <button
        type="button"
        className="h-8.5 rounded-full border border-border bg-white px-4 text-xs font-semibold text-destructive transition hover:bg-destructive/10 sm:h-9.5"
      >
        Blocked
      </button>
    );
  }

  if (isFriend) {
    return (
      <>
        <button
          type="button"
          onClick={onMessage}
          className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-white text-slate-700 transition hover:bg-slate-50 sm:h-9.75 sm:w-9.75"
          aria-label="Message"
        >
          <Mail className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="h-8.5 rounded-full border border-border bg-white px-4 text-xs font-semibold text-foreground transition hover:bg-muted sm:h-9.5"
        >
          Friends
        </button>
      </>
    );
  }

  if (requestReceived) {
    return (
      <button
        type="button"
        className="h-8.5 rounded-full bg-brand-gradient-h px-4 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 sm:h-9.5"
      >
        Accept Request
      </button>
    );
  }

  if (requestSent) {
    return (
      <button
        type="button"
        className="h-8.5 rounded-full border border-border bg-white px-4 text-xs font-semibold text-muted-foreground transition hover:bg-muted sm:h-9.5"
      >
        Request Sent
      </button>
    );
  }

  return (
    <button
      type="button"
      className="h-8.5 rounded-full bg-brand-gradient-h px-4 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 sm:h-9.5"
    >
      Add Friend
    </button>
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
  onMoreOptions,
  onMessage,
}) {
  const pictureInputRef = useRef(null);
  const coverInputRef = useRef(null);

  if (!profile) return null;

  const { name, bio, profilePicture, coverPicture, postCount, friendCount, relationship } = profile;

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
            <button
              type="button"
              onClick={onMoreOptions}
              className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full border border-border bg-white text-slate-700 transition hover:bg-slate-50 sm:h-9.75 sm:w-9.75"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {isOwn ? (
              <button
                type="button"
                className="h-8.5 rounded-full border border-border bg-white px-4 text-xs font-semibold text-foreground transition hover:bg-muted sm:h-9.5"
              >
                Edit Profile
              </button>
            ) : (
              <RelationshipButton
                relationship={relationship}
                onMessage={onMessage}
              />
            )}
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
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatCount(friendCount)}
            </span>{" "}
            Friends
          </p>
        </div>
      </div>
    </>
  );
}

export default ProfileDetailsSection;

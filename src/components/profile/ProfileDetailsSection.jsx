import { Mail, MoreHorizontal } from "lucide-react";
import AppButton from "@/components/common/AppButton";

function formatCompactCount(value) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

function ProfileDetailsSection({
  userDetails,
  onFollow,
  onMessage,
  onMoreOptions,
}) {
  if (!userDetails) {
    return null;
  }

  const {
    name,
    username,
    bio,
    image,
    coverImage,
    followers,
    following,
    postsCount,
    followedBy,
  } = userDetails;

  return (
    <>
      <div className="relative h-48 sm:h-56">
        <img src={coverImage} alt={`${name} cover`} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/20" />
        <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white/90">
          let&apos;s live
        </p>
        <div className="absolute -bottom-10 left-4 h-[84px] w-[84px] rounded-full bg-[linear-gradient(135deg,#B839F1_0%,#FF2727_100%)] p-[2px] sm:left-6 sm:h-[124px] sm:w-[124px]">
          <div className="h-full w-full overflow-hidden rounded-full bg-white p-[2px]">
            <img
              src={image}
              alt={name}
              className="h-full w-full rounded-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 px-4 pb-5 pt-12 sm:px-6 sm:pb-6 sm:pt-[84px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold leading-none text-foreground">
              {name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">@{username}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onMoreOptions}
              className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-border bg-white text-slate-700 transition hover:bg-slate-50 sm:h-[39px] sm:w-[39px]"
              aria-label="More options"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onMessage}
              className="inline-flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-border bg-white text-slate-700 transition hover:bg-slate-50 sm:h-[39px] sm:w-[39px]"
              aria-label="Message profile"
            >
              <Mail className="h-4 w-4" />
            </button>
            <AppButton
              onClick={onFollow}
              className="h-[34px] w-[110px] cursor-pointer rounded-full bg-[linear-gradient(90deg,#B839F1_0%,#FF2727_100%)] px-0 text-xs font-semibold text-white shadow-sm transition hover:opacity-90 sm:h-[38px] sm:w-[126px]"
            >
              <span className="inline-flex h-[15px] w-[87px] items-center justify-center">
                Follow
              </span>
            </AppButton>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          {bio ??
            `Hi, I am ${name}. I specialize in planning and executing high-impact corporate events and social experiences.`}
        </p>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-1 text-sm">
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatCompactCount(following ?? 0)}
            </span>{" "}
            Following
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {formatCompactCount(followers ?? 0)}
            </span>{" "}
            Followers
          </p>
          <p className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {postsCount ?? 0}
            </span>{" "}
            Posts
          </p>
        </div>

        {followedBy ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <img
              src={followedBy.image}
              alt={followedBy.name}
              className="h-6 w-6 rounded-full object-cover"
              loading="lazy"
            />
            <span>Followed by {followedBy.name}</span>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default ProfileDetailsSection;

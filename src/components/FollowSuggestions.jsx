import AppButton from "@/components/common/AppButton";

function FollowSuggestion({ profile }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-[linear-gradient(135deg,#B839F1_0%,#FF2727_100%)] p-[2px]">
          <img
            src={profile.image}
            alt={profile.name}
            className="h-[27px] w-[27px] rounded-full bg-white object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {profile.name}
          </p>
          <p className="text-[12px] font-medium text-muted-foreground">
            @{profile.username}
          </p>
        </div>
      </div>
      <AppButton className="h-[21px] w-[91px] rounded-full bg-[linear-gradient(90deg,#B839F1_0%,#FF2727_100%)] px-2 text-[12px] font-semibold leading-none text-white shadow-sm hover:opacity-90">
        Follow
      </AppButton>
    </li>
  );
}

function FollowSuggestions({ profiles }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">You might like</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {profiles.map((profile) => (
          <FollowSuggestion key={profile.id} profile={profile} />
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-[#B839F1] transition hover:text-[#FF2727]"
      >
        Show More
      </button>
    </section>
  );
}

export default FollowSuggestions;

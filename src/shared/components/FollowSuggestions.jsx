import AppButton from "@/shared/components/common/AppButton";

function FollowSuggestion({ profile }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="h-[31px] w-[31px] rounded-full bg-brand-gradient p-0.5">
          <img
            src={profile.image}
            alt={profile.name}
            className="h-[27px] w-[27px] rounded-full bg-white dark:bg-background object-cover"
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
      <AppButton className="h-[26px] w-[88px] cursor-pointer rounded-[47px] bg-brand-gradient-h px-0 text-[12px] font-semibold leading-none text-white shadow-sm hover:opacity-90">
        <span className="inline-flex h-[15px] w-[87px] items-center justify-center">
          Follow
        </span>
      </AppButton>
    </li>
  );
}

function FollowSuggestions({ profiles }) {
  return (
    <section className="rounded-2xl p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          You might like
        </h2>
      </div>
      <ul className="mt-4 space-y-3">
        {profiles.map((profile) => (
          <FollowSuggestion key={profile.id} profile={profile} />
        ))}
      </ul>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-[#B839F1] dark:text-[#7F5AF0] transition hover:text-[#FF2727] dark:hover:text-[#2CB8E8]"
      >
        Show More
      </button>
    </section>
  );
}

export default FollowSuggestions;

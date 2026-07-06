function Story({ profile }) {
  return (
    <div className="flex min-w-18 flex-col items-center gap-2">
      <div className="rounded-full bg-brand-gradient p-0.5">
        <div className="h-14 w-14 overflow-hidden rounded-full bg-white dark:bg-background p-0.5">
          <img
            src={profile.image}
            alt={profile.name}
            className="h-full w-full rounded-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <span className="text-xs text-muted-foreground">{profile.username}</span>
    </div>
  );
}

export default Story;

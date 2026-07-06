import { cn } from "@/lib/utils";
import heartIcon from "@/assets/icons/heart-red.svg";
import { getCountdownLabel, getEventDateLabel } from "@/shared/utils/helpers";

function EventSuggestion({ event }) {
  const { day, month } = getEventDateLabel(event.startDateTime);
  const countdown = getCountdownLabel(event.startDateTime);

  return (
    <article className="cursor-pointer space-y-3">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="shrink-0 rounded-full bg-brand-gradient p-0.5">
            {event.user.image ? (
              <img
                src={event.user.image}
                alt={event.user.name}
                className="h-7 w-7 rounded-full bg-white object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[9px] font-semibold text-slate-600">
                {event.user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <span className="truncate text-xs font-medium text-foreground">
            {event.user.username}
          </span>
        </div>
        <button
          type="button"
          className="ml-2 shrink-0 cursor-pointer text-xs font-semibold text-[#B839F1] transition hover:text-[#FF2727]"
        >
          Follow
        </button>
      </header>

      {/* Fluid card — no max-w constraint, fills sidebar column */}
      <div className="relative w-full overflow-hidden rounded-[10px] aspect-[289/215]">
        <img
          src={event.image}
          alt={`${event.user.username} event`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute right-3 top-3 flex flex-col items-center rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          <span className="text-base leading-4">{day}</span>
          <span className="text-[10px] uppercase">{month}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3 text-xs text-white">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 font-semibold",
            )}
          >
            <img src={heartIcon} alt="" className="h-3.5 w-3.5" />
            {event.likes}
          </span>
          <span className="rounded-full bg-black/55 px-3 py-1 font-semibold">
            {countdown}
          </span>
        </div>
      </div>
    </article>
  );
}

function EventSuggestions({ events }) {
  return (
    <section className="rounded-2xl p-3">
      <h2 className="text-sm font-semibold text-foreground">
        Events you might like
      </h2>
      <div className="mt-4 space-y-4">
        {events.map((event) => (
          <EventSuggestion key={event.id} event={event} />
        ))}
      </div>
      <button
        type="button"
        className="mt-4 text-xs font-semibold text-[#B839F1] transition hover:text-[#FF2727]"
      >
        See All
      </button>
    </section>
  );
}

export default EventSuggestions;

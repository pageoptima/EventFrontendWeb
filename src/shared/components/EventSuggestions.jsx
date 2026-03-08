import heartIcon from "@/assets/icons/heart-red.svg";
import { getCountdownLabel, getEventDateLabel } from "@/shared/utils/helpers";

function EventSuggestion({ event }) {
  const { day, month } = getEventDateLabel(event.startDateTime);
  const countdown = getCountdownLabel(event.startDateTime);

  return (
    <article className="cursor-pointer space-y-3">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[linear-gradient(135deg,#B839F1_0%,#FF2727_100%)] p-[2px]">
            {event.user.image ? (
              <img
                src={event.user.image}
                alt={event.user.name}
                className="h-[27px] w-[27px] rounded-full bg-white object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-[27px] w-[27px] items-center justify-center rounded-full bg-white text-[9px] font-semibold text-slate-600">
                {event.user.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <span className="text-[12px] font-medium text-foreground">
            {event.user.username}
          </span>
        </div>
        <button
          type="button"
          className="cursor-pointer text-xs font-semibold text-[#B839F1] transition hover:text-[#FF2727]"
        >
          <span className="inline-flex h-[15px] w-[87px] items-center justify-center">
            Follow
          </span>
        </button>
      </header>
      <div className="relative w-full max-w-[289px] overflow-hidden rounded-[10px] aspect-[289/215]">
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
          <span className="inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 font-semibold">
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
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">
          Events you might like
        </h2>
      </div>
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


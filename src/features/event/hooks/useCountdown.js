import { useState, useEffect } from "react";

function compute(startsAt, endsAt, now) {
  if (!startsAt) return { state: "none" };

  const start = new Date(startsAt).getTime();
  const end = endsAt ? new Date(endsAt).getTime() : null;

  if (now < start) {
    const totalSecs = Math.floor((start - now) / 1000);
    return {
      state: "upcoming",
      days: Math.floor(totalSecs / 86400),
      hours: Math.floor((totalSecs % 86400) / 3600),
      minutes: Math.floor((totalSecs % 3600) / 60),
      seconds: totalSecs % 60,
    };
  }

  if (end !== null && now < end) return { state: "live" };

  return { state: "ended" };
}

/**
 * Returns a live countdown relative to the browser clock.
 *
 * state: "none" | "upcoming" | "live" | "ended"
 * When state === "upcoming": { days, hours, minutes, seconds }
 */
export function useCountdown(startsAt, endsAt) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!startsAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  return compute(startsAt, endsAt, now);
}

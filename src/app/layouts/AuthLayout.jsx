import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import eventIcon from "@/assets/icons/event.svg";

const SLIDES = [
  {
    heading: "Discover events happening around you",
    body: "Connect with people, explore events, and share your experiences with the world.",
  },
  {
    heading: "Follow people who share your passion",
    body: "Build your community, follow event enthusiasts and stay updated on what's happening near you.",
  },
  {
    heading: "Share your moments with the world",
    body: "Post your event experiences and let others discover what you're up to.",
  },
];

const SLIDE_INTERVAL = 4000;

function AuthLayout() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* ── Left brand panel (tablet+) ── */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 flex-col items-center justify-center bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)] p-12 text-white">
        <div className="max-w-xs w-full">
          {/* Brand mark */}
          <div className="mb-10 flex items-center gap-3">
            <img src={eventIcon} alt="" className="h-10 w-10" />
            <span className="text-3xl font-bold tracking-tight">Event</span>
          </div>

          {/* Slide content — fixed height so dots don't jump */}
          <div className="relative h-48">
            {SLIDES.map((slide, i) => (
              <div
                key={i}
                aria-hidden={i !== active}
                className={[
                  "absolute inset-0 transition-opacity duration-700",
                  i === active ? "opacity-100" : "opacity-0 pointer-events-none",
                ].join(" ")}
              >
                <h2 className="text-3xl font-bold leading-snug">{slide.heading}</h2>
                <p className="mt-4 text-base leading-relaxed text-white/70">{slide.body}</p>
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="mt-4 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={[
                  "h-2 rounded-full transition-all duration-500",
                  i === active ? "w-6 bg-white/80" : "w-2 bg-white/40 hover:bg-white/60",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12">
        {/* Mobile-only brand mark */}
        <div className="mb-8 flex items-center gap-3 md:hidden">
          <img src={eventIcon} alt="" className="h-8 w-8" />
          <span className="text-2xl font-bold text-foreground">Event</span>
        </div>

        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

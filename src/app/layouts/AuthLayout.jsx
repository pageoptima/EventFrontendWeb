import { Outlet } from "react-router-dom";
import eventIcon from "@/assets/icons/event.svg";

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* ── Left brand panel (tablet+) ── */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 flex-col items-center justify-center bg-[linear-gradient(135deg,#2A104F_0%,#2A104F_50%,#8B1B3E_70%,#FF2323_100%)] p-12 text-white">
        <div className="max-w-xs w-full">
          <div className="mb-10 flex items-center gap-3">
            <img src={eventIcon} alt="" className="h-10 w-10" />
            <span className="text-3xl font-bold tracking-tight">Event</span>
          </div>
          <h2 className="text-3xl font-bold leading-snug">
            Discover events happening around you
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/70">
            Connect with people, explore events, and share your experiences
            with the world.
          </p>

          {/* Decorative dots */}
          <div className="mt-16 flex gap-2">
            <span className="h-2 w-6 rounded-full bg-white/80" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
            <span className="h-2 w-2 rounded-full bg-white/40" />
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

import { MapPin } from "lucide-react";
import { formatTeaserDateLabel } from "@/components/teaser/teaserUtils";

function TeaserMetaOverlay({ teaser, profile }) {
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 to-transparent" />

      <div className="absolute inset-x-0 bottom-4 px-4">
        <div className="flex items-end justify-between gap-3 text-white">
          <div className="min-w-0 flex flex-1 items-start gap-2.5">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="min-w-0 flex flex-col gap-1.5">
              <p className="text-[16px] font-normal leading-5 tracking-[-0.017em] break-words">
                {teaser.place ?? "Location"}
              </p>
              <span className="inline-flex h-[22px] w-[86px] items-center justify-center rounded-[58px] bg-[rgba(255,255,255,0.48)] text-[8px] font-medium uppercase tracking-wide text-white">
                {formatTeaserDateLabel(teaser.startDateTime)}
              </span>
            </div>
          </div>

          <img
            src={profile?.image ?? teaser.image}
            alt={profile?.name ?? teaser.userId}
            className="h-8 w-8 shrink-0 cursor-pointer rounded-full border-2 border-white/85 object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
}

export default TeaserMetaOverlay;

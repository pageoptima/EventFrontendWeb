import TeaserSlide from "@/components/teaser/TeaserSlide";
import { profiles } from "@/config/profiles";
import { teasers } from "@/config/teaser";

const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

function Teaser() {
  return (
    <section className="h-[calc(100vh-3rem)]">
      <div className="no-scrollbar h-full overflow-y-auto snap-y snap-mandatory">
        {teasers.map((teaser) => (
          <TeaserSlide
            key={teaser.id}
            teaser={teaser}
            profile={profilesById.get(teaser.userId)}
          />
        ))}
      </div>
    </section>
  );
}

export default Teaser;

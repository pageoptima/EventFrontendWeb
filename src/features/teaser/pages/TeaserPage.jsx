import TeaserSlide from "@/features/teaser/components/TeaserSlide";
import useTeaserFeed from "@/features/teaser/hooks/useTeaserFeed";
import { profiles } from "@/app/config/profiles";
import { teasers } from "@/app/config/teaser";

function TeaserPage() {
  const teaserFeed = useTeaserFeed(teasers, profiles);

  return (
    <section className="h-[calc(100vh-3rem)]">
      <div className="no-scrollbar h-full overflow-y-auto snap-y snap-mandatory">
        {teaserFeed.map(({ teaser, profile }, index) => (
          <TeaserSlide
            key={teaser.id}
            teaser={teaser}
            profile={profile}
            shouldPreload={index < 2}
          />
        ))}
      </div>
    </section>
  );
}

export default TeaserPage;

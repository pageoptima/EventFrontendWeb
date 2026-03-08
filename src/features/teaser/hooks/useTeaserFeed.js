import { useMemo } from "react";

function useTeaserFeed(teasers, profiles) {
  return useMemo(() => {
    const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

    return teasers.map((teaser) => ({
      teaser,
      profile: profilesById.get(teaser.userId),
    }));
  }, [teasers, profiles]);
}

export default useTeaserFeed;

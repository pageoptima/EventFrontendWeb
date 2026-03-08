import { useMemo, useState } from "react";
import RightSidebar from "@/shared/components/RightSidebar";
import ProfileDetailsSection from "@/features/profile/components/ProfileDetailsSection";
import ProfilePostsSection from "@/features/profile/components/ProfilePostsSection";
import { events } from "@/app/config/events";
import { feedPosts } from "@/app/config/posts";
import { profiles } from "@/app/config/profiles";
import { teasers } from "@/app/config/teaser";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("events");
  const activeProfile = profiles[0];
  const followedByProfile = profiles[5] ?? profiles[1];

  const eventGallery = useMemo(() => {
    const eventCards = events.map((event, index) => ({
      id: `event-gallery-${event.id}`,
      image: event.image,
      caption: `Upcoming event #${index + 1}`,
      likes: event.likes,
      views: `${(index + 2) * 9}k`,
    }));

    const postCards = feedPosts.map((post, index) => ({
      id: `post-gallery-${post.id}`,
      image: post.image,
      caption: `Event moment ${index + 1}`,
      likes: post.likes,
      views: post.views,
    }));

    return [...eventCards, ...postCards].slice(0, 12);
  }, []);

  const teaserGallery = useMemo(
    () =>
      teasers.map((teaser, index) => ({
        id: teaser.id,
        image: teaser.image,
        caption: teaser.caption ?? `Teaser ${index + 1}`,
        likes: teaser.likes ?? "0",
        views: teaser.views ?? "0",
      })),
    [],
  );

  const userDetails = useMemo(
    () => ({
      ...activeProfile,
      postsCount: eventGallery.length,
      followedBy: followedByProfile,
    }),
    [activeProfile, eventGallery.length, followedByProfile],
  );

  const postsByTab = useMemo(
    () => ({
      events: eventGallery,
      teaser: teaserGallery,
    }),
    [eventGallery, teaserGallery],
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section>
        <article className="overflow-hidden rounded-2xl border border-border">
          <ProfileDetailsSection userDetails={userDetails} />
          <ProfilePostsSection
            activeTab={activeTab}
            onTabChange={setActiveTab}
            postsByTab={postsByTab}
          />
        </article>
      </section>
      <RightSidebar />
    </div>
  );
}

export default ProfilePage;

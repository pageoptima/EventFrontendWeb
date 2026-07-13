import FeedEvent from "@/features/home/components/FeedEvent";
import RightSidebar from "@/shared/components/RightSidebar";
import StoriesSection from "@/features/home/components/StoriesSection";
import { feedEvents } from "@/app/config/events";
import { profiles } from "@/app/config/profiles";

function HomePage() {
  const stories = profiles.slice(0, 8);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section className="space-y-6">
        <StoriesSection profiles={stories} />
        {feedEvents.map((event) => (
          <FeedEvent key={event.id} event={event} />
        ))}
      </section>
      <RightSidebar />
    </div>
  );
}

export default HomePage;

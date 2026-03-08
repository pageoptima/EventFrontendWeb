import FeedPost from "@/features/home/components/FeedPost";
import RightSidebar from "@/shared/components/RightSidebar";
import StoriesSection from "@/features/home/components/StoriesSection";
import { feedPosts } from "@/app/config/posts";
import { profiles } from "@/app/config/profiles";

function HomePage() {
  const stories = profiles.slice(0, 8);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_252px] xl:grid-cols-[minmax(0,1fr)_313px]">
      <section className="space-y-6">
        <StoriesSection profiles={stories} />
        <section className="space-y-6">
          {feedPosts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </section>
      </section>
      <RightSidebar />
    </div>
  );
}

export default HomePage;

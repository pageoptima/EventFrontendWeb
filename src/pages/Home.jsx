import FeedPost from "@/components/FeedPost";
import RightSidebar from "@/components/RightSidebar";
import StoriesSection from "@/components/StoriesSection";
import { feedPosts } from "@/config/posts";
import { profiles } from "@/config/profiles";

function Home() {
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

export default Home;

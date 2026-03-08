import Story from "@/features/home/components/Story";

function StoriesSection({ profiles }) {
  return (
    <section className="rounded-xl p-4">
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
        {profiles.map((profile) => (
          <Story key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
}

export default StoriesSection;

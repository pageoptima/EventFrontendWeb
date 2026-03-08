import EventSuggestions from "@/shared/components/EventSuggestions";
import FollowSuggestions from "@/shared/components/FollowSuggestions";
import { events } from "@/app/config/events";
import { profiles } from "@/app/config/profiles";

const followSuggestions = profiles.slice(0, 3);
const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
const eventSuggestions = events.map((event) => ({
  ...event,
  user: profilesById.get(event.userId) ?? {
    id: event.userId,
    username: event.userId.replace("user-", "user_id"),
    name: event.userId,
    image: "",
  },
}));

function RightSidebar() {
  return (
    <aside className="no-scrollbar space-y-4 lg:fixed lg:top-0 lg:right-6 lg:h-screen lg:w-63 lg:pt-6 lg:pb-6 lg:overflow-y-auto lg:overflow-x-hidden xl:w-[313px]">
      <FollowSuggestions profiles={followSuggestions} />
      <EventSuggestions events={eventSuggestions} />
    </aside>
  );
}

export default RightSidebar;

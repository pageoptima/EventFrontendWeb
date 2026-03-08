import { Grid3X3, PlaySquare } from "lucide-react";
import GalleryCard from "@/features/profile/components/GalleryCard";

const tabs = [
  { key: "events", label: "Events", Icon: Grid3X3 },
  { key: "teaser", label: "Teaser", Icon: PlaySquare },
];

function ProfilePostsSection({ activeTab, onTabChange, postsByTab }) {
  const gallery = postsByTab?.[activeTab] ?? [];

  return (
    <div className="border-t border-border px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
      <div className="grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === tab.key
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            }`}
          >
            <tab.Icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
        {gallery.map((item) => (
          <GalleryCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default ProfilePostsSection;

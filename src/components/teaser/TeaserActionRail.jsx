import {
  Bookmark,
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";
import TeaserActionButton from "@/components/teaser/TeaserActionButton";

const iconClassName = "h-7 w-7";

function TeaserActionRail({ teaser, isMuted, onToggleAudio }) {
  return (
    <div className="flex flex-col items-center gap-4 text-foreground">
      <TeaserActionButton
        aria-label={`${teaser.likes} likes`}
        count={teaser.likes}
      >
        <Heart className={iconClassName} strokeWidth={1.8} />
      </TeaserActionButton>

      <TeaserActionButton
        onClick={onToggleAudio}
        aria-label={isMuted ? "Unmute teaser" : "Mute teaser"}
      >
        {isMuted ? (
          <VolumeX className={iconClassName} strokeWidth={1.8} />
        ) : (
          <Volume2 className={iconClassName} strokeWidth={1.8} />
        )}
      </TeaserActionButton>

      <TeaserActionButton
        aria-label={`${teaser.comments} comments`}
        count={teaser.comments}
      >
        <MessageCircle className={`${iconClassName} -scale-x-100`} strokeWidth={1.8} />
      </TeaserActionButton>

      <TeaserActionButton aria-label="Share teaser">
        <Share2 className={iconClassName} strokeWidth={1.8} />
      </TeaserActionButton>

      <TeaserActionButton aria-label="Save teaser" className="mt-10">
        <Bookmark className={iconClassName} strokeWidth={1.8} />
      </TeaserActionButton>
    </div>
  );
}

export default TeaserActionRail;

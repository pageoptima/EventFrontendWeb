import {
  Bookmark,
  Heart,
  MessageCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import shareIcon from "@/assets/icons/share.svg";
import { Button } from "@/components/ui/button";

const baseButtonClass =
  "h-auto w-auto cursor-pointer p-0 text-foreground hover:bg-transparent hover:text-foreground";

function TeaserActionRail({ teaser, isMuted, onToggleAudio }) {
  return (
    <div className="flex flex-col items-center gap-4 text-foreground">
      <Button
        type="button"
        variant="ghost"
        aria-label={`${teaser.likes} likes`}
        className={`${baseButtonClass} flex-col gap-1`}
      >
        <Heart className="h-7 w-7" strokeWidth={1.8} />
        <span className="text-base font-medium leading-none sm:text-lg">
          {teaser.likes}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        onClick={onToggleAudio}
        aria-label={isMuted ? "Unmute teaser" : "Mute teaser"}
        className={baseButtonClass}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" strokeWidth={1.8} />
        ) : (
          <Volume2 className="h-6 w-6" strokeWidth={1.8} />
        )}
      </Button>

      <Button
        type="button"
        variant="ghost"
        aria-label={`${teaser.comments} comments`}
        className={`${baseButtonClass} flex-col gap-1`}
      >
        <MessageCircle className="h-7 w-7 -scale-x-100" strokeWidth={1.8} />
        <span className="text-base font-medium leading-none sm:text-lg">
          {teaser.comments}
        </span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        aria-label="Share teaser"
        className={baseButtonClass}
      >
        <img src={shareIcon} alt="" className="h-7 w-7" />
      </Button>

      <Button
        type="button"
        variant="ghost"
        aria-label="Save teaser"
        className={`${baseButtonClass} mt-10`}
      >
        <Bookmark className="h-7 w-7" strokeWidth={1.8} />
      </Button>
    </div>
  );
}

export default TeaserActionRail;

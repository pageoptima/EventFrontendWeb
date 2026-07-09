import { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_MIME = "image/jpeg,image/png,image/webp,image/gif,video/mp4";

function MediaUploadZone({ onFilesSelected, disabled, maxFiles, currentCount }) {
  const inputRef = useRef(null);
  const remaining = maxFiles - currentCount;

  const open = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!disabled) onFilesSelected(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    if (e.target.files?.length) {
      onFilesSelected(e.target.files);
      e.target.value = "";
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload media files"
      onClick={open}
      onKeyDown={(e) => e.key === "Enter" && open()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 text-center transition-colors",
        disabled
          ? "cursor-not-allowed border-border opacity-50"
          : "cursor-pointer border-[#B839F1]/40 hover:border-[#B839F1] hover:bg-[#B839F1]/5 dark:border-[#7F5AF0]/40 dark:hover:border-[#7F5AF0] dark:hover:bg-[#7F5AF0]/5",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_MIME}
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <UploadCloud className="h-10 w-10 text-[#B839F1]/50 dark:text-[#7F5AF0]/50" />
      <div>
        <p className="text-sm font-semibold text-foreground">
          Drop files here or click to browse
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG · PNG · WebP · GIF · MP4 &nbsp;·&nbsp; Max 50 MB each &nbsp;·&nbsp;{" "}
          {remaining} file{remaining !== 1 ? "s" : ""} remaining
        </p>
      </div>
    </div>
  );
}

export default MediaUploadZone;

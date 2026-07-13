import { useState } from "react";
import { Globe, Users, Lock, X, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const VISIBILITY_OPTIONS = [
  { value: "PUBLIC", label: "Everyone", Icon: Globe },
  { value: "FRIENDS", label: "Friends", Icon: Users },
  { value: "PRIVATE", label: "Only me", Icon: Lock },
];

const MAX_CAPTION = 2200;
const MAX_TAGS = 30;

function TagInput({ tags, onAdd, onRemove }) {
  const [input, setInput] = useState("");

  const commit = () => {
    if (input.trim()) {
      onAdd(input);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commit();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onRemove(tags[tags.length - 1]);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-1.5 rounded-lg border border-border bg-transparent p-2",
        "focus-within:ring-2 focus-within:ring-[#B839F1]/40 dark:focus-within:ring-[#7F5AF0]/40",
      )}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-[#B839F1]/10 px-2.5 py-0.5 text-xs font-medium text-[#B839F1] dark:bg-[#7F5AF0]/15 dark:text-[#7F5AF0]"
        >
          #{tag}
          <button
            type="button"
            onClick={() => onRemove(tag)}
            aria-label={`Remove tag ${tag}`}
            className="ml-0.5 transition-colors hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={tags.length === 0 ? "Add tags — press Enter or comma…" : ""}
        className="min-w-24 flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
        maxLength={50}
        disabled={tags.length >= MAX_TAGS}
      />
    </div>
  );
}

function EventDetailsForm({
  form,
  onFormChange,
  onAddTag,
  onRemoveTag,
  canPublish,
  isProcessing,
  processingTimedOut,
  publishState,
  publishError,
  onPublish,
}) {
  const isPublishing = publishState === "publishing";

  return (
    <div className="flex flex-col gap-5">
      {/* Caption */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Caption</label>
        <textarea
          value={form.caption}
          onChange={(e) => onFormChange({ caption: e.target.value })}
          placeholder="Write a caption…"
          rows={4}
          maxLength={MAX_CAPTION}
          className={cn(
            "w-full resize-none rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm",
            "placeholder:text-muted-foreground transition",
            "focus:outline-none focus:ring-2 focus:ring-[#B839F1]/40 dark:focus:ring-[#7F5AF0]/40",
          )}
        />
        <p className="text-right text-xs text-muted-foreground">
          {form.caption.length}/{MAX_CAPTION}
        </p>
      </div>

      {/* Visibility */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Audience</label>
        <div className="flex gap-2">
          {VISIBILITY_OPTIONS.map(({ value, label, Icon }) => {
            const active = form.visibility === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => onFormChange({ visibility: value })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition",
                  active
                    ? "border-[#B839F1] bg-[#B839F1]/10 text-[#B839F1] dark:border-[#7F5AF0] dark:bg-[#7F5AF0]/15 dark:text-[#7F5AF0]"
                    : "border-border text-muted-foreground hover:border-[#B839F1]/50 dark:hover:border-[#7F5AF0]/50",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-foreground">Tags</label>
          <span className="text-xs text-muted-foreground">
            {form.tags.length}/{MAX_TAGS}
          </span>
        </div>
        <TagInput tags={form.tags} onAdd={onAddTag} onRemove={onRemoveTag} />
      </div>

      {/* Publish error */}
      {publishError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
          {publishError}
        </p>
      )}

      {/* Backend media processing — spinner while waiting, error on timeout */}
      {isProcessing && (
        <div className="flex items-center gap-2 rounded-lg bg-[#7F5AF0]/10 px-3 py-2.5">
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[#7F5AF0]" />
          <p className="text-xs text-[#7F5AF0]">Processing media, almost ready…</p>
        </div>
      )}

      {processingTimedOut && (
        <div className="flex items-start gap-2 rounded-lg bg-destructive/10 px-3 py-2.5">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
          <p className="text-xs text-destructive">
            Media processing is taking too long. This is a server issue — please
            remove your files, try again, or come back later.
          </p>
        </div>
      )}

      {/* Publish button */}
      <button
        type="button"
        onClick={onPublish}
        disabled={!canPublish || isPublishing}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-white transition",
          "bg-[linear-gradient(90deg,#7F5AF0_0%,#2CB8E8_100%)] hover:opacity-90 active:opacity-80",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {isPublishing && <Loader2 className="h-4 w-4 animate-spin" />}
        {isPublishing ? "Publishing…" : "Publish Event"}
      </button>
    </div>
  );
}

export default EventDetailsForm;

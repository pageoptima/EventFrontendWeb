import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useCreateEvent } from "@/features/event/hooks/useCreateEvent";
import MediaUploadZone from "@/features/createEvent/components/MediaUploadZone";
import MediaPreviewGrid from "@/features/createEvent/components/MediaPreviewGrid";
import EventDetailsForm from "@/features/createEvent/components/EventDetailsForm";

function CreateEventPage() {
  const navigate = useNavigate();
  const {
    draftState,
    mediaItems,
    form,
    publishState,
    publishError,
    canPublish,
    isProcessing,
    processingTimedOut,
    maxFiles,
    addFiles,
    removeMedia,
    retryUpload,
    updateForm,
    addTag,
    removeTag,
    publish,
  } = useCreateEvent();

  useEffect(() => {
    if (publishState === "success") {
      navigate("/", { replace: true });
    }
  }, [publishState, navigate]);

  if (draftState === "error") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Could not start a new event. Please refresh and try again.
        </p>
      </div>
    );
  }

  const atMax = mediaItems.length >= maxFiles;

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-semibold text-foreground">Create Event</h1>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Media</h2>
          <span className="text-xs text-muted-foreground">
            {mediaItems.length}/{maxFiles}
          </span>
        </div>

        <MediaPreviewGrid items={mediaItems} onRemove={removeMedia} onRetry={retryUpload} />

        {!atMax && (
          <MediaUploadZone
            onFilesSelected={addFiles}
            disabled={draftState !== "ready"}
            maxFiles={maxFiles}
            currentCount={mediaItems.length}
          />
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <EventDetailsForm
          form={form}
          onFormChange={updateForm}
          onAddTag={addTag}
          onRemoveTag={removeTag}
          canPublish={canPublish}
          isProcessing={isProcessing}
          processingTimedOut={processingTimedOut}
          publishState={publishState}
          publishError={publishError}
          onPublish={publish}
        />
      </section>
    </div>
  );
}

export default CreateEventPage;

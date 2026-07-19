import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useCreateTeaser } from "@/features/teaser/hooks/useCreateTeaser";
import TeaserMediaUploadZone from "@/features/createTeaser/components/TeaserMediaUploadZone";
import TeaserMediaPreview from "@/features/createTeaser/components/TeaserMediaPreview";
import TeaserDetailsForm from "@/features/createTeaser/components/TeaserDetailsForm";

function CreateTeaserPage() {
  const navigate = useNavigate();
  const {
    draftId,
    draftState,
    mediaItem,
    form,
    publishState,
    publishError,
    canPublish,
    isProcessing,
    processingTimedOut,
    setFile,
    removeMedia,
    retryUpload,
    updateForm,
    addTag,
    removeTag,
    publish,
  } = useCreateTeaser();

  useEffect(() => {
    if (publishState === "success" && draftId) {
      navigate(`/teasers/${draftId}`, { replace: true });
    }
  }, [publishState, draftId, navigate]);

  if (draftState === "error") {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-center">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-muted-foreground">
          Could not start a new teaser. Please refresh and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      <h1 className="text-xl font-semibold text-foreground">Create Teaser</h1>

      <section className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-medium text-foreground">Media</h2>

        {mediaItem ? (
          <TeaserMediaPreview item={mediaItem} onRemove={removeMedia} onRetry={retryUpload} />
        ) : (
          <TeaserMediaUploadZone onFileSelected={setFile} disabled={draftState !== "ready"} />
        )}
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <TeaserDetailsForm
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

export default CreateTeaserPage;

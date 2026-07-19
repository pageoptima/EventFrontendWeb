import { X, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

function TeaserMediaPreview({ item, onRemove, onRetry }) {
  if (!item) return null;

  const { uploadStatus, previewUrl, file } = item;
  const isUploading = uploadStatus === "uploading" || uploadStatus === "pending";
  const isError = uploadStatus === "error";
  const isUploaded = uploadStatus === "uploaded";

  return (
    <div className="relative mx-auto aspect-9/16 max-h-120 w-full max-w-72 overflow-hidden rounded-2xl border border-border bg-muted">
      <video src={previewUrl} className="h-full w-full object-cover" muted playsInline controls />

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}

      {isError && (
        <button
          type="button"
          onClick={onRetry}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/65"
          aria-label={`Retry upload for ${file.name}`}
        >
          <AlertCircle className="h-5 w-5 text-red-400" />
          <RefreshCw className="h-4 w-4 text-white" />
          <span className="text-xs font-medium text-white">Retry</span>
        </button>
      )}

      {isUploaded && (
        <span className="absolute bottom-2 right-2 drop-shadow-md">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        disabled={isUploading}
        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default TeaserMediaPreview;

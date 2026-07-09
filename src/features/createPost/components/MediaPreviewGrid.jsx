import { X, Loader2, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

function MediaPreviewItem({ item, onRemove, onRetry }) {
  const isImage = item.file.type.startsWith("image/");
  const { uploadStatus, previewUrl, file, localId } = item;
  const isUploading = uploadStatus === "uploading" || uploadStatus === "pending";
  const isError = uploadStatus === "error";
  const isUploaded = uploadStatus === "uploaded";

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
      {isImage ? (
        <img
          src={previewUrl}
          alt={file.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <video src={previewUrl} className="h-full w-full object-cover" muted playsInline />
      )}

      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="h-6 w-6 animate-spin text-white" />
        </div>
      )}

      {isError && (
        <button
          type="button"
          onClick={() => onRetry(localId)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/65"
          aria-label={`Retry upload for ${file.name}`}
        >
          <AlertCircle className="h-5 w-5 text-red-400" />
          <RefreshCw className="h-4 w-4 text-white" />
          <span className="text-xs font-medium text-white">Retry</span>
        </button>
      )}

      {isUploaded && (
        <span className="absolute bottom-1.5 right-1.5 drop-shadow-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        </span>
      )}

      <button
        type="button"
        onClick={() => onRemove(localId)}
        disabled={isUploading}
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Remove ${file.name}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}

function MediaPreviewGrid({ items, onRemove, onRetry }) {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <MediaPreviewItem
          key={item.localId}
          item={item}
          onRemove={onRemove}
          onRetry={onRetry}
        />
      ))}
    </div>
  );
}

export default MediaPreviewGrid;

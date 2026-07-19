import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDraft,
  getDraft,
  getMediaUploadUrl,
  uploadToS3,
  completeUpload,
  updateDraft,
  publishDraft,
  deleteDraftMedia,
} from "@/features/teaser/services/teaserService";
import { teaserKeys } from "@/features/teaser/teaserQueryKeys";
import { getApiErrorMessage } from "@/shared/utils/errors";

// The backend only accepts VIDEO for teaser media (teaser.service.ts rejects
// anything else with "Only Video is allowed."), even though the DTO's
// mediaType field is typed as the shared IMAGE | VIDEO enum.
const ALLOWED_TYPES = new Set(["video/mp4"]);
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const POLL_INTERVAL_MS = 2_000;
const PROCESSING_TIMEOUT_MS = 90_000;

function buildMediaItem(file) {
  return {
    localId: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    mediaId: null,
    uploadStatus: "pending",
  };
}

export function useCreateTeaser() {
  const queryClient = useQueryClient();
  const [draftId, setDraftId] = useState(null);
  const draftIdRef = useRef(null);

  const [draftState, setDraftState] = useState("creating");
  const [mediaItem, setMediaItem] = useState(null);
  const [form, setForm] = useState({
    caption: "",
    visibility: "PUBLIC",
    tags: [],
  });
  const [publishState, setPublishState] = useState("idle");
  const [publishError, setPublishError] = useState(null);
  const [processingTimedOut, setProcessingTimedOut] = useState(false);

  const abortControllerRef = useRef(null);
  const mediaItemRef = useRef(null);

  useEffect(() => {
    mediaItemRef.current = mediaItem;
  }, [mediaItem]);

  useEffect(() => {
    return () => {
      if (mediaItemRef.current) URL.revokeObjectURL(mediaItemRef.current.previewUrl);
    };
  }, []);

  // ── Draft initialisation ────────────────────────────────────────────────────

  const { mutate: initDraft } = useMutation({
    mutationFn: async () => {
      const draft = await createDraft();
      const full = await getDraft(draft.id);
      return { id: draft.id, ...full };
    },
    onSuccess: async (data) => {
      draftIdRef.current = data.id;
      setDraftId(data.id);

      if (data.media) {
        await deleteDraftMedia(data.id).catch(() => {});
      }

      setDraftState("ready");
    },
    onError: () => setDraftState("error"),
  });

  useEffect(() => {
    initDraft();
  }, [initDraft]);

  // ── Media helpers ───────────────────────────────────────────────────────────
  // A teaser has exactly one media slot — selecting a new file replaces any existing one.

  const updateMediaItem = useCallback((localId, patch) => {
    setMediaItem((prev) => (prev && prev.localId === localId ? { ...prev, ...patch } : prev));
  }, []);

  const uploadMediaFile = useCallback(
    async (localId, file) => {
      const id = draftIdRef.current;
      if (!id) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;
      updateMediaItem(localId, { uploadStatus: "uploading" });

      let mediaId = null;
      try {
        const result = await getMediaUploadUrl(id, {
          mediaType: "VIDEO",
          mimeType: file.type,
          fileName: file.name,
          size: file.size,
        });
        mediaId = result.mediaId;

        if (controller.signal.aborted) {
          deleteDraftMedia(id).catch(() => {});
          return;
        }

        updateMediaItem(localId, { mediaId });
        await uploadToS3(result.uploadUrl, file, controller.signal);
        await completeUpload(mediaId);
        updateMediaItem(localId, { uploadStatus: "uploaded" });
      } catch (err) {
        if (err.name === "AbortError") {
          if (mediaId) deleteDraftMedia(draftIdRef.current).catch(() => {});
          return;
        }
        updateMediaItem(localId, { uploadStatus: "error" });
      } finally {
        if (abortControllerRef.current === controller) abortControllerRef.current = null;
      }
    },
    [updateMediaItem],
  );

  const setFile = useCallback(
    (fileList) => {
      const file = fileList?.[0];
      if (!file) return;
      if (!ALLOWED_TYPES.has(file.type) || file.size > MAX_FILE_SIZE_BYTES) return;

      setProcessingTimedOut(false);

      const previous = mediaItemRef.current;
      if (previous) {
        URL.revokeObjectURL(previous.previewUrl);
        abortControllerRef.current?.abort();
        if (previous.mediaId) deleteDraftMedia(draftIdRef.current).catch(() => {});
      }

      const item = buildMediaItem(file);
      setMediaItem(item);
      uploadMediaFile(item.localId, file);
    },
    [uploadMediaFile],
  );

  const removeMedia = useCallback(async () => {
    const item = mediaItemRef.current;
    if (!item) return;

    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    URL.revokeObjectURL(item.previewUrl);
    setMediaItem(null);

    if (item.mediaId) {
      deleteDraftMedia(draftIdRef.current).catch(() => {});
    }
  }, []);

  const retryUpload = useCallback(async () => {
    const item = mediaItemRef.current;
    if (!item || item.uploadStatus !== "error") return;

    if (item.mediaId) {
      await deleteDraftMedia(draftIdRef.current).catch(() => {});
      updateMediaItem(item.localId, { mediaId: null });
    }

    uploadMediaFile(item.localId, item.file);
  }, [uploadMediaFile, updateMediaItem]);

  // ── Form helpers ────────────────────────────────────────────────────────────

  const updateForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const addTag = useCallback((raw) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, "-");
    if (!tag) return;
    setForm((prev) => {
      if (prev.tags.includes(tag) || prev.tags.length >= 30) return prev;
      return { ...prev, tags: [...prev.tags, tag] };
    });
  }, []);

  const removeTag = useCallback((tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  }, []);

  // ── Publish ─────────────────────────────────────────────────────────────────

  const publish = useCallback(async () => {
    const id = draftIdRef.current;
    if (!id) return;

    setPublishState("publishing");
    setPublishError(null);

    try {
      await updateDraft(id, {
        caption: form.caption.trim() || undefined,
        visibility: form.visibility,
        tags: form.tags,
      });

      await publishDraft(id);
      queryClient.invalidateQueries({ queryKey: teaserKeys.userTeasers("me") });
      setPublishState("success");
    } catch (err) {
      setPublishError(getApiErrorMessage(err));
      setPublishState("error");
    }
  }, [form, queryClient]);

  // ── Processing / canPublish derived state ───────────────────────────────────

  const isUploading =
    mediaItem?.uploadStatus === "uploading" || mediaItem?.uploadStatus === "pending";
  const allUploadsDone = !!mediaItem && !isUploading && mediaItem.uploadStatus === "uploaded";

  useEffect(() => {
    if (!allUploadsDone) return;
    const timer = setTimeout(() => setProcessingTimedOut(true), PROCESSING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [allUploadsDone]);

  const draftQuery = useQuery({
    queryKey: teaserKeys.draft(draftId),
    queryFn: () => getDraft(draftId),
    enabled: !!draftId && allUploadsDone && !processingTimedOut,
    staleTime: 0,
    refetchInterval: (query) =>
      query.state.data?.canPublish ? false : POLL_INTERVAL_MS,
  });

  const isProcessing = allUploadsDone && !processingTimedOut && !draftQuery.data?.canPublish;

  const canPublish =
    draftState === "ready" &&
    !!draftQuery.data?.canPublish &&
    publishState !== "publishing" &&
    publishState !== "success";

  return {
    draftId,
    draftState,
    mediaItem,
    form,
    publishState,
    publishError,
    canPublish,
    isUploading,
    isProcessing,
    processingTimedOut,
    setFile,
    removeMedia,
    retryUpload,
    updateForm,
    addTag,
    removeTag,
    publish,
  };
}

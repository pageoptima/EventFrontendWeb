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
} from "@/features/event/services/eventService";
import { eventKeys } from "@/features/event/eventQueryKeys";
import { getApiErrorMessage } from "@/shared/utils/errors";

const MAX_FILES = 10;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
]);
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;
const POLL_INTERVAL_MS = 2_000;
const PROCESSING_TIMEOUT_MS = 90_000;

function buildMediaItem(file, order) {
  return {
    localId: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    mediaId: null,
    order,
    uploadStatus: "pending",
  };
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const [draftId, setDraftId] = useState(null);
  const draftIdRef = useRef(null);

  const [draftState, setDraftState] = useState("creating");
  const [mediaItems, setMediaItems] = useState([]);
  const [form, setForm] = useState({ caption: "", visibility: "PUBLIC", tags: [] });
  const [publishState, setPublishState] = useState("idle");
  const [publishError, setPublishError] = useState(null);
  const [processingTimedOut, setProcessingTimedOut] = useState(false);

  const abortControllersRef = useRef(new Map());
  const mediaItemsRef = useRef([]);

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const { mutate: initDraft } = useMutation({
    mutationFn: async () => {
      const draft = await createDraft();
      const full = await getDraft(draft.id);
      return { id: draft.id, ...full };
    },
    onSuccess: async (data) => {
      draftIdRef.current = data.id;
      setDraftId(data.id);

      if (data.medias?.length > 0) {
        await Promise.all(
          data.medias.map((m) => deleteDraftMedia(data.id, m.id).catch(() => {})),
        );
      }

      setDraftState("ready");
    },
    onError: () => setDraftState("error"),
  });

  useEffect(() => {
    initDraft();
  }, [initDraft]);

  const updateMediaItem = useCallback((localId, patch) => {
    setMediaItems((prev) =>
      prev.map((item) => (item.localId === localId ? { ...item, ...patch } : item)),
    );
  }, []);

  const uploadMediaFile = useCallback(
    async (localId, file, order) => {
      const id = draftIdRef.current;
      if (!id) return;

      const controller = new AbortController();
      abortControllersRef.current.set(localId, controller);
      updateMediaItem(localId, { uploadStatus: "uploading" });

      let mediaId = null;
      try {
        const result = await getMediaUploadUrl(id, {
          mediaType: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          mimeType: file.type,
          fileName: file.name,
          size: file.size,
          order,
        });
        mediaId = result.mediaId;

        if (controller.signal.aborted) {
          deleteDraftMedia(id, mediaId).catch(() => {});
          return;
        }

        updateMediaItem(localId, { mediaId });
        await uploadToS3(result.uploadUrl, file, controller.signal);
        await completeUpload(mediaId);
        updateMediaItem(localId, { uploadStatus: "uploaded" });
      } catch (err) {
        if (err.name === "AbortError") {
          if (mediaId) deleteDraftMedia(draftIdRef.current, mediaId).catch(() => {});
          return;
        }
        updateMediaItem(localId, { uploadStatus: "error" });
      } finally {
        abortControllersRef.current.delete(localId);
      }
    },
    [updateMediaItem],
  );

  const addFiles = useCallback(
    (files) => {
      setProcessingTimedOut(false);
      const current = mediaItemsRef.current;
      const available = MAX_FILES - current.length;
      if (available <= 0) return;

      const valid = Array.from(files)
        .filter((f) => ALLOWED_TYPES.has(f.type) && f.size <= MAX_FILE_SIZE_BYTES)
        .slice(0, available);

      if (!valid.length) return;

      const startOrder = current.length;
      const newItems = valid.map((file, i) => buildMediaItem(file, startOrder + i));

      setMediaItems((prev) => [...prev, ...newItems]);
      newItems.forEach((item) => uploadMediaFile(item.localId, item.file, item.order));
    },
    [uploadMediaFile],
  );

  const removeMedia = useCallback(async (localId) => {
    const item = mediaItemsRef.current.find((m) => m.localId === localId);
    if (!item) return;

    const controller = abortControllersRef.current.get(localId);
    controller?.abort();
    abortControllersRef.current.delete(localId);

    URL.revokeObjectURL(item.previewUrl);
    setMediaItems((prev) => prev.filter((m) => m.localId !== localId));

    if (item.mediaId) {
      deleteDraftMedia(draftIdRef.current, item.mediaId).catch(() => {});
    }
  }, []);

  const retryUpload = useCallback(
    async (localId) => {
      const item = mediaItemsRef.current.find((m) => m.localId === localId);
      if (!item || item.uploadStatus !== "error") return;

      if (item.mediaId) {
        await deleteDraftMedia(draftIdRef.current, item.mediaId).catch(() => {});
        updateMediaItem(localId, { mediaId: null });
      }

      uploadMediaFile(localId, item.file, item.order);
    },
    [uploadMediaFile, updateMediaItem],
  );

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
      queryClient.invalidateQueries({ queryKey: eventKeys.userEvents("me") });
      setPublishState("success");
    } catch (err) {
      setPublishError(getApiErrorMessage(err));
      setPublishState("error");
    }
  }, [form, queryClient]);

  const isUploading = mediaItems.some(
    (m) => m.uploadStatus === "uploading" || m.uploadStatus === "pending",
  );
  const allUploadsDone =
    mediaItems.length > 0 &&
    !isUploading &&
    mediaItems.every((m) => m.uploadStatus === "uploaded");

  useEffect(() => {
    if (!allUploadsDone) return;
    const timer = setTimeout(() => setProcessingTimedOut(true), PROCESSING_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [allUploadsDone]);

  const draftQuery = useQuery({
    queryKey: eventKeys.draft(draftId),
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
    draftState,
    mediaItems,
    form,
    publishState,
    publishError,
    canPublish,
    isUploading,
    isProcessing,
    processingTimedOut,
    maxFiles: MAX_FILES,
    addFiles,
    removeMedia,
    retryUpload,
    updateForm,
    addTag,
    removeTag,
    publish,
  };
}

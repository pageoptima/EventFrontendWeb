import api from "@/shared/utils/apis";

export const createDraft = () =>
  api.post("/posts/drafts").then((r) => r.data);

export const getDraft = (postId) =>
  api.get(`/posts/drafts/${postId}`).then((r) => r.data);

export const getMediaUploadUrl = (postId, payload) =>
  api.post(`/posts/drafts/${postId}/media/upload-url`, payload).then((r) => r.data);

export const uploadToS3 = (uploadUrl, file, signal) =>
  fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
    signal,
  }).then((r) => {
    if (!r.ok) throw new Error(`S3 upload failed with status ${r.status}`);
  });

export const completeUpload = (mediaId) =>
  api.post("/media/complete-upload", { mediaId }).then((r) => r.data);

export const updateDraft = (postId, payload) =>
  api.patch(`/posts/drafts/${postId}`, payload).then((r) => r.data);

export const publishDraft = (postId) =>
  api.post(`/posts/drafts/${postId}/publish`).then((r) => r.data);

export const deleteDraftMedia = (postId, mediaId) =>
  api.delete(`/posts/drafts/${postId}/media/${mediaId}`).then((r) => r.data);

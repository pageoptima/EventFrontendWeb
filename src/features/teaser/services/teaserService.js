import api from "@/shared/utils/apis";

export const createDraft = () =>
  api.post("/teasers/drafts").then((r) => r.data);

export const getDraft = (teaserId) =>
  api.get(`/teasers/drafts/${teaserId}`).then((r) => r.data);

export const getMediaUploadUrl = (teaserId, payload) =>
  api.post(`/teasers/drafts/${teaserId}/media/upload-url`, payload).then((r) => r.data);

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

export const updateDraft = (teaserId, payload) =>
  api.patch(`/teasers/drafts/${teaserId}`, payload).then((r) => r.data);

export const publishDraft = (teaserId) =>
  api.post(`/teasers/drafts/${teaserId}/publish`).then((r) => r.data);

// A teaser has exactly one media slot — no mediaId needed, unlike posts.
export const deleteDraftMedia = (teaserId) =>
  api.delete(`/teasers/drafts/${teaserId}/media`).then((r) => r.data);

export const getUserTeasers = ({ userId, cursor, limit = 20 }) => {
  const url = userId === "me" ? "/teasers/users/me" : `/teasers/users/${userId}`;
  return api
    .get(url, { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);
};

export const getTeaser = (teaserId) =>
  api.get(`/teasers/${teaserId}`).then((r) => r.data);

export const toggleTeaserLike = (teaserId) =>
  api.post(`/teasers/${teaserId}/likes`).then((r) => r.data);

export const getTeaserComments = ({ teaserId, cursor, limit = 20 }) =>
  api
    .get(`/teasers/${teaserId}/comments`, { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);

export const createTeaserComment = ({ teaserId, content, parentId }) =>
  api
    .post(`/teasers/${teaserId}/comments`, { content, ...(parentId && { parentId }) })
    .then((r) => r.data);

export const toggleTeaserCommentLike = (commentId) =>
  api.post(`/teasers/comments/${commentId}/like`).then((r) => r.data);

export const getTeaserLikes = ({ teaserId, cursorUserId, cursorCreatedAt, limit = 20 }) =>
  api
    .get(`/teasers/${teaserId}/likes`, {
      params: {
        limit,
        ...(cursorUserId && { cursorUserId }),
        ...(cursorCreatedAt && { cursorCreatedAt }),
      },
    })
    .then((r) => r.data);

export const deleteTeaser = (teaserId) =>
  api.delete(`/teasers/${teaserId}`).then((r) => r.data);

export const changeTeaserVisibility = (teaserId, visibility) =>
  api.patch(`/teasers/${teaserId}/visibility`, { visibility }).then((r) => r.data);

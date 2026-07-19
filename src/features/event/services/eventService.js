import api from "@/shared/utils/apis";

export const createDraft = () =>
  api.post("/posts/drafts").then((r) => r.data);

export const getDraft = (eventId) =>
  api.get(`/posts/drafts/${eventId}`).then((r) => r.data);

export const getMediaUploadUrl = (eventId, payload) =>
  api.post(`/posts/drafts/${eventId}/media/upload-url`, payload).then((r) => r.data);

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

export const updateDraft = (eventId, payload) =>
  api.patch(`/posts/drafts/${eventId}`, payload).then((r) => r.data);

export const publishDraft = (eventId) =>
  api.post(`/posts/drafts/${eventId}/publish`).then((r) => r.data);

export const deleteDraftMedia = (eventId, mediaId) =>
  api.delete(`/posts/drafts/${eventId}/media/${mediaId}`).then((r) => r.data);

export const getUserEvents = ({ userId, cursor, limit = 20 }) => {
  const url = userId === "me" ? "/posts/users/me" : `/posts/users/${userId}`;
  return api
    .get(url, { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);
};

export const getEvent = (eventId) =>
  api.get(`/posts/${eventId}`).then((r) => r.data);

export const toggleEventLike = (eventId) =>
  api.post(`/posts/${eventId}/likes`).then((r) => r.data);

export const getEventComments = ({ eventId, cursor, limit = 20 }) =>
  api
    .get(`/posts/${eventId}/comments`, { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);

export const createEventComment = ({ eventId, content, parentId }) =>
  api
    .post(`/posts/${eventId}/comments`, { content, ...(parentId && { parentId }) })
    .then((r) => r.data);

export const toggleCommentLike = (commentId) =>
  api.post(`/posts/comments/${commentId}/like`).then((r) => r.data);

export const getEventLikes = ({ eventId, cursorUserId, cursorCreatedAt, limit = 20 }) =>
  api
    .get(`/posts/${eventId}/likes`, {
      params: {
        limit,
        ...(cursorUserId && { cursorUserId }),
        ...(cursorCreatedAt && { cursorCreatedAt }),
      },
    })
    .then((r) => r.data);

export const deleteEvent = (eventId) =>
  api.delete(`/posts/${eventId}`).then((r) => r.data);

export const changeEventVisibility = (eventId, visibility) =>
  api.patch(`/posts/${eventId}/visibility`, { visibility }).then((r) => r.data);

export const upsertLocation = (payload) =>
  api.post("/locations", payload).then((r) => r.data);

export const toggleEventSave = (eventId) =>
  api.post(`/posts/${eventId}/saves`).then((r) => r.data);

export const getSavedEvents = ({ cursor, limit = 20 } = {}) =>
  api
    .get("/posts/users/saves", { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);

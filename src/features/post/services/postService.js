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

export const getUserPosts = ({ userId, cursor, limit = 20 }) => {
  const url = userId === "me" ? "/posts/users/me" : `/posts/users/${userId}`;
  return api
    .get(url, { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);
};

export const getPost = (postId) =>
  api.get(`/posts/${postId}`).then((r) => r.data);

export const togglePostLike = (postId) =>
  api.post(`/posts/${postId}/likes`).then((r) => r.data);

export const getPostComments = ({ postId, cursor, limit = 20 }) =>
  api
    .get(`/posts/${postId}/comments`, { params: { limit, ...(cursor && { cursor }) } })
    .then((r) => r.data);

export const createPostComment = ({ postId, content, parentId }) =>
  api
    .post(`/posts/${postId}/comments`, { content, ...(parentId && { parentId }) })
    .then((r) => r.data);

export const toggleCommentLike = (commentId) =>
  api.post(`/posts/comments/${commentId}/like`).then((r) => r.data);

export const deletePost = (postId) =>
  api.delete(`/posts/${postId}`).then((r) => r.data);

export const changePostVisibility = (postId, visibility) =>
  api.patch(`/posts/${postId}/visibility`, { visibility }).then((r) => r.data);

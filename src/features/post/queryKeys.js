export const postKeys = {
  all: ["post"],
  draft: (id) => [...postKeys.all, "draft", id],
  detail: (id) => [...postKeys.all, "detail", id],
  userPosts: (userId) => [...postKeys.all, "userPosts", userId],
  comments: (postId) => [...postKeys.all, "comments", postId],
};

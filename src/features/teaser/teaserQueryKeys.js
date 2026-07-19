export const teaserKeys = {
  all: ["teaser"],
  draft: (id) => [...teaserKeys.all, "draft", id],
  detail: (id) => [...teaserKeys.all, "detail", id],
  userTeasers: (userId) => [...teaserKeys.all, "userTeasers", userId],
  comments: (teaserId) => [...teaserKeys.all, "comments", teaserId],
  likes: (teaserId) => [...teaserKeys.all, "likes", teaserId],
  saved: () => [...teaserKeys.all, "saved"],
};

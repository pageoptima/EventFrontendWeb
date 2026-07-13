export const eventKeys = {
  all: ["event"],
  draft: (id) => [...eventKeys.all, "draft", id],
  detail: (id) => [...eventKeys.all, "detail", id],
  userEvents: (userId) => [...eventKeys.all, "userEvents", userId],
  comments: (eventId) => [...eventKeys.all, "comments", eventId],
  likes: (eventId) => [...eventKeys.all, "likes", eventId],
};

import api from "@/shared/utils/apis";

export const getMyProfile = () =>
  api.get("/profile/me").then((r) => r.data);

export const getUserProfile = (id) =>
  api.get(`/profile/${id}`).then((r) => r.data);

const multipart = { headers: { "Content-Type": undefined } };

export const updateProfilePicture = (file) => {
  const form = new FormData();
  form.append("image", file);
  return api.patch("/profile/picture", form, multipart).then((r) => r.data);
};

export const updateCoverPicture = (file) => {
  const form = new FormData();
  form.append("image", file);
  return api.patch("/profile/cover-picture", form, multipart).then((r) => r.data);
};

export const updateProfile = (data) =>
  api.patch("/profile", data).then((r) => r.data);

export const updateAddress = (data) =>
  api.patch("/profile/address", data).then((r) => r.data);

export const updateSettings = (data) =>
  api.patch("/profile/settings", data).then((r) => r.data);

export const updateEmail = (data) =>
  api.patch("/profile/email", data).then((r) => r.data);

export const updatePhone = (data) =>
  api.patch("/profile/phone", data).then((r) => r.data);

import { HTTP_STATUS } from "@/shared/utils/constants";

/**
 * Extracts a human-readable message from an Axios error.
 * Handles NestJS-style { message: string | string[] } bodies.
 */
export function getApiErrorMessage(error) {
  const data = error?.response?.data;

  if (data) {
    const { message } = data;
    if (Array.isArray(message) && message.length > 0) return message[0];
    if (typeof message === "string" && message) return message;
  }

  if (error?.request) return "Network error. Please check your connection.";

  return "Something went wrong. Please try again.";
}

export const isUnauthorized = (error) =>
  error?.response?.status === HTTP_STATUS.UNAUTHORIZED;

export const isConflict = (error) =>
  error?.response?.status === HTTP_STATUS.CONFLICT;

export const isNotFound = (error) =>
  error?.response?.status === HTTP_STATUS.NOT_FOUND;

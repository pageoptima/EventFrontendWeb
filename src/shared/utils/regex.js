// RFC-5322 simplified — sufficient for client-side pre-validation
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// lowercase letters, numbers, dots, underscores only
export const USERNAME_REGEX = /^[a-z0-9._]+$/;

// E.164 international phone format
export const PHONE_REGEX = /^\+[1-9]\d{1,14}$/;

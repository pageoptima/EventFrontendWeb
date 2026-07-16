export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// redux-persist storage key
export const PERSIST_KEY = "event-app";

// Validation constraints — kept here so form rules and server rules stay in sync
export const VALIDATION = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PROFILE_NAME_MAX: 100,
  PASSWORD_MIN: 3,
  PASSWORD_MAX: 100,
  USERNAME_MIN: 2,
  USERNAME_MAX: 50,
  PROFILE_USERNAME_MIN: 3,
  PROFILE_USERNAME_MAX: 30,
  BIO_MAX: 500,
  ADDRESS_LINE_MAX: 255,
};

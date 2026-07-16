import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/stores/slices/authSlice";
import { register } from "@/features/auth/services/authService";
import { VALIDATION } from "@/shared/utils/constants";
import { getApiErrorMessage } from "@/shared/utils/errors";
import { EMAIL_REGEX } from "@/shared/utils/regex";
import { decodeJwt } from "@/shared/utils/jwt";

const INITIAL_FIELDS = { name: "", username: "", email: "", password: "" };
const INITIAL_ERRORS = { name: "", username: "", email: "", password: "" };

function validate({ name, username, email, password }) {
  const errors = {};
  const trimmedName = name.trim();
  if (
    trimmedName.length < VALIDATION.NAME_MIN ||
    trimmedName.length > VALIDATION.NAME_MAX
  ) {
    errors.name = `Name must be ${VALIDATION.NAME_MIN}–${VALIDATION.NAME_MAX} characters.`;
  }
  const trimmedUsername = username.trim();
  if (
    trimmedUsername.length < VALIDATION.USERNAME_MIN ||
    trimmedUsername.length > VALIDATION.USERNAME_MAX
  ) {
    errors.username = `Username must be ${VALIDATION.USERNAME_MIN}–${VALIDATION.USERNAME_MAX} characters.`;
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (password.length < VALIDATION.PASSWORD_MIN) {
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN} characters.`;
  }
  return errors;
}

export function useRegisterForm() {
  const dispatch = useDispatch();
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: ({ accessToken }) => {
      dispatch(setCredentials({ accessToken, user: decodeJwt(accessToken) }));
    },
  });

  const handleChange = ({ target: { name, value } }) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (mutation.isError) mutation.reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }
    mutation.mutate({
      name: fields.name.trim(),
      username: fields.username.trim(),
      email: fields.email.trim(),
      password: fields.password,
    });
  };

  return {
    fields,
    fieldErrors,
    apiError: mutation.isError ? getApiErrorMessage(mutation.error) : "",
    isLoading: mutation.isPending,
    handleChange,
    handleSubmit,
  };
}

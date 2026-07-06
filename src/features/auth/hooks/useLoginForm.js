import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/stores/slices/authSlice";
import { login } from "@/features/auth/services/authService";
import { VALIDATION } from "@/shared/utils/constants";
import { getApiErrorMessage } from "@/shared/utils/errors";
import { EMAIL_REGEX } from "@/shared/utils/regex";
import { decodeJwt } from "@/shared/utils/jwt";

const INITIAL_FIELDS = { email: "", password: "" };
const INITIAL_ERRORS = { email: "", password: "" };

function validate({ email, password }) {
  const errors = {};
  if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (password.length < VALIDATION.PASSWORD_MIN) {
    errors.password = `Password must be at least ${VALIDATION.PASSWORD_MIN} characters.`;
  }
  return errors;
}

export function useLoginForm() {
  const dispatch = useDispatch();
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);

  const mutation = useMutation({
    mutationFn: login,
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
    mutation.mutate({ email: fields.email.trim(), password: fields.password });
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

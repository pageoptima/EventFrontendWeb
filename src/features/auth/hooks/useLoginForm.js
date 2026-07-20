import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/stores/slices/authSlice";
import { login } from "@/features/auth/services/authService";
import { VALIDATION } from "@/shared/utils/constants";
import { getApiErrorMessage } from "@/shared/utils/errors";
import { decodeJwt } from "@/shared/utils/jwt";

const INITIAL_FIELDS = { identifier: "", password: "" };
const INITIAL_ERRORS = { identifier: "", password: "" };

function validate({ identifier, password }) {
  const errors = {};
  if (!identifier.trim()) {
    errors.identifier = "Email or username is required.";
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
      // PublicRoute redirects away from /auth/* once isAuthenticated flips
      // true, sending the user back to location.state.from if present.
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
    mutation.mutate({ identifier: fields.identifier.trim(), password: fields.password });
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

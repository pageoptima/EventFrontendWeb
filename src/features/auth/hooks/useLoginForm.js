import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: ({ accessToken }) => {
      dispatch(setCredentials({ accessToken, user: decodeJwt(accessToken) }));
      // Return to the page that triggered the login redirect (e.g. a shared
      // event/teaser link), falling back to home.
      const from = location.state?.from;
      navigate(from ? `${from.pathname}${from.search}` : "/", { replace: true });
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

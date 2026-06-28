import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setCredentials } from "@/stores/slices/authSlice";
import { login } from "@/features/auth/services/authService";
import { VALIDATION } from "@/shared/utils/constants";
import { getApiErrorMessage } from "@/shared/utils/errors";
import { EMAIL_REGEX } from "@/shared/utils/regex";

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
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ?? "/";

  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [fieldErrors, setFieldErrors] = useState(INITIAL_ERRORS);
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = ({ target: { name, value } }) => {
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear the field error as the user corrects it
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors((prev) => ({ ...prev, ...errors }));
      return;
    }

    setIsLoading(true);
    try {
      const { accessToken } = await login({
        email: fields.email.trim(),
        password: fields.password,
      });
      dispatch(setCredentials({ accessToken, user: null }));
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return { fields, fieldErrors, apiError, isLoading, handleChange, handleSubmit };
}

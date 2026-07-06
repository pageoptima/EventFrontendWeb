import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AuthFormField from "@/features/auth/components/AuthFormField";
import AuthFormError from "@/features/auth/components/AuthFormError";
import AuthPasswordField from "@/features/auth/components/AuthPasswordField";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";

function LoginPage() {
  const { fields, fieldErrors, apiError, isLoading, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <AuthFormError message={apiError} />

        <AuthFormField
          id="email"
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={handleChange}
          error={fieldErrors.email}
          disabled={isLoading}
        />

        <AuthPasswordField
          id="password"
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={fields.password}
          onChange={handleChange}
          error={fieldErrors.password}
          disabled={isLoading}
        />

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-gradient-h text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-[#B839F1] dark:text-[#7F5AF0] transition hover:text-[#FF2727] dark:hover:text-[#2CB8E8]"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;

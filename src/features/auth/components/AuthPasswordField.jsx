import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

function AuthPasswordField({
  label = "Password",
  id = "password",
  name = "password",
  error,
  disabled,
  ...inputProps
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          disabled={disabled}
          className={cn(
            "w-full rounded-lg border bg-transparent px-3 py-2.5 pr-10 text-sm text-foreground",
            "placeholder:text-muted-foreground transition",
            "focus:outline-none focus:ring-2 focus:ring-[#B839F1]/40 dark:focus:ring-[#7F5AF0]/40",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error
              ? "border-destructive"
              : "border-border hover:border-[#B839F1]/50 dark:hover:border-[#7F5AF0]/50",
          )}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          disabled={disabled}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed"
        >
          {show ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </div>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default AuthPasswordField;

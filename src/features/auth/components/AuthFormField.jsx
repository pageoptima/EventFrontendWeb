import { cn } from "@/lib/utils";

function AuthFormField({ label, id, error, className, ...inputProps }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        className={cn(
          "w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm text-foreground",
          "placeholder:text-muted-foreground transition",
          "focus:outline-none focus:ring-2 focus:ring-[#B839F1]/40",
          error
            ? "border-destructive"
            : "border-border hover:border-[#B839F1]/50",
        )}
        {...inputProps}
      />
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

export default AuthFormField;

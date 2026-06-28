import { cn } from "@/lib/utils";

const baseButtonClass =
  "inline-flex h-auto w-auto cursor-pointer border-0 bg-transparent p-0 text-foreground";

function TeaserActionButton({ onClick, className, count, children, ...rest }) {
  const hasCount = count !== undefined && count !== null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        baseButtonClass,
        hasCount ? "flex-col gap-1" : "items-center justify-center",
        className,
      )}
      {...rest}
    >
      {children}
      {hasCount ? (
        <span className="text-sm font-medium leading-none sm:text-base">
          {count}
        </span>
      ) : null}
    </button>
  );
}

export default TeaserActionButton;

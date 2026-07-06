import * as React from "react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/lib/utils";

function renderIcon(icon, className, alt) {
  if (!icon) return null;
  return <img src={icon} alt={alt} className={className} />;
}

function AppButton({
  leftIcon,
  rightIcon,
  leftIconAlt = "",
  rightIconAlt = "",
  iconSize = "h-4 w-4",
  iconClassName,
  leftIconClassName,
  rightIconClassName,
  className,
  asChild = false,
  children,
  ...props
}) {
  const iconBase = cn(iconSize, iconClassName);
  const left = renderIcon(
    leftIcon,
    cn(iconBase, leftIconClassName),
    leftIconAlt,
  );
  const right = renderIcon(
    rightIcon,
    cn(iconBase, rightIconClassName),
    rightIconAlt,
  );

  const isChild = asChild && React.isValidElement(children);
  const label = isChild ? children.props.children : children;

  const content = (
    <>
      {left ? <span className="inline-flex items-center">{left}</span> : null}
      <span className="inline-flex items-center">{label}</span>
      {right ? <span className="inline-flex items-center">{right}</span> : null}
    </>
  );

  if (isChild) {
    const child = React.cloneElement(children, {}, content);
    return (
      <Button
        asChild
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        {child}
      </Button>
    );
  }

  return (
    <Button
      className={cn("inline-flex items-center gap-2", className)}
      {...props}
    >
      {content}
    </Button>
  );
}

export default AppButton;

import { ComponentProps } from "react";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

export const buttonClasses = cva(
  [
    "border-none",
    "text-sm",
    "py-1.5",
    "px-2",
    "border-r-4",
    "overflow-hidden",
    "inline-flex",
    "items-center",
    "justify-center",
    "transition-colors",
    "focus-visible:ring-1",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-0",
    "outline-none",
    "disabled:opacity-50",
    "hover:bg-accent/90",
    "hover:text-accent-foreground",
  ],
  {
    variants: {
      active: {
        true: "transition-none bg-accent text-accent-foreground",
      },
    },
  }
);

export const Button = ({
  active,
  className,
  style,
  ...props
}: ComponentProps<"button"> & { active?: boolean }) => {
  return (
    <button {...props} className={cn(buttonClasses({ active }), className)} />
  );
};

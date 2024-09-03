import { cva } from "class-variance-authority";

export const InputGroupSuffixClasses = cva(
  [
    "h-10",
    "rounded-md",
    "border",
    "border-input",
    "bg-background",
    "px-3",
    "py-2",
    "text-sm",
    "ring-offset-background",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-ring",
    "focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        suffix: ["border-l-0", "rounded-l-none"],
        prefix: ["border-r-0", "rounded-r-none"],
      },
    },
    defaultVariants: {
      variant: "suffix",
    },
  }
);

export const InputGroupInputClasses = cva(
  [
    "rounded-r-none",
    "focus:ring-0",
    "focus-visible:ring-0",
    "focus-visible:ring-offset-0",
  ],
  {
    variants: {
      variant: {
        suffix: ["rounded-r-none"],
        prefix: ["rounded-l-none"],
      },
    },
    defaultVariants: {
      variant: "suffix",
    },
  }
);

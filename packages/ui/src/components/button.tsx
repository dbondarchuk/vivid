import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../utils";
import { TextVariants, textVariants } from "./text";

const buttonVariants = {
  primary:
    // "border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground ",
    "bg-primary text-primary-foreground hover:bg-primary/90",
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  outline:
    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  "link-underline": "text-primary underline-offset-4 underline",
  "link-dashed": "text-primary underline-offset-4 underline decoration-dashed",
};

export const buttonSizes = {
  none: "",
  default: "h-9 px-4 py-2",
  xs: "h-7 rounded-md px-3 text-xs [&>svg]:size-3",
  sm: "h-8 rounded-md px-3 text-xs",
  md: "h-9 rounded-md px-5",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};

const buttonClasses = cva(
  [
    "inline-flex gap-1 [&>svg]:size-4 items-center justify-center whitespace-nowrap rounded-md text-sm font-normal ring-offset-background transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    "no-underline",
  ],
  {
    variants: {
      isMenu: {
        true: "w-full cursor-pointer justify-start",
      },
      variant: buttonVariants,
      size: buttonSizes,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ButtonVariant = VariantProps<typeof buttonClasses>["variant"];
export const ButtonVariants = Object.keys(
  buttonVariants
) as (keyof typeof buttonVariants)[];

export type ButtonSize = VariantProps<typeof buttonClasses>["size"];
export const ButtonSizes = Object.keys(
  buttonSizes
) as (keyof typeof buttonSizes)[];

export type ButtonVariants = VariantProps<typeof buttonClasses>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonClasses>,
    TextVariants {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fontSize,
      fontWeight,
      font,
      asChild = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          textVariants({ font, fontSize, fontWeight }),
          buttonClasses({ variant, size }),
          className
        )}
        type={type}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonClasses as buttonVariants };

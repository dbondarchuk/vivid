import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const fonts = {
  default: "",
  body: "font-primary",
  header: "font-secondary",
};

const textSizes = {
  default: "",
  sm: "text-sm",
  md: "text-md",
  lg: "text-lg",
  xl: "text-xl",
};

const textWeights = {
  default: "",
  thin: "font-thin",
  extralight: "font-extralight",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

const textClasses = cva([], {
  variants: {
    font: fonts,
    fontSize: textSizes,
    fontWeight: textWeights,
  },
  defaultVariants: {
    font: "default",
    fontSize: "default",
    fontWeight: "default",
  },
});

export type TextVariants = VariantProps<typeof textClasses>;

export type TextFont = VariantProps<typeof textClasses>["font"];
export const TextFonts = Object.keys(fonts) as (keyof typeof fonts)[];

export type TextSize = VariantProps<typeof textClasses>["fontSize"];
export const TextSizes = Object.keys(textSizes) as (keyof typeof textSizes)[];

export type TextWeight = VariantProps<typeof textClasses>["fontWeight"];
export const TextWeights = Object.keys(
  textWeights
) as (keyof typeof textWeights)[];

export interface TextProps
  extends React.ButtonHTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof textClasses> {
  asChild?: boolean;
}

const Text = React.forwardRef<HTMLButtonElement, TextProps>(
  (
    { className, fontSize, fontWeight, font, asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        className={cn(textClasses({ fontSize, fontWeight, font, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export { Text, textClasses as textVariants };

import { cva, VariantProps } from "class-variance-authority";
import NextLink from "next/link";
import React from "react";
import { ButtonSize, ButtonVariant, buttonVariants } from "./button";

export const linkVariants = cva(
  ["text-black", "hover:text-gray-800", "transition-all", "font-thin"],
  {
    variants: {
      variant: {
        default: "underline",
        standalone: "no-underline",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
  }
);

export type LinkVariant = VariantProps<typeof linkVariants>["variant"];
export type LinkSize = VariantProps<typeof linkVariants>["size"];

type BaseProps = Omit<React.ComponentProps<typeof NextLink>, "as"> & {
  variant?: LinkVariant;
  size?: LinkSize;
  target?: "_blank" | "_parent" | "_self" | "_top";
};

type ButtonLinkProps = BaseProps & {
  button?: true;
  as?: "link" | "externalLink";
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type LinkProps = BaseProps | ButtonLinkProps;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (props, ref) => {
    const classes =
      "button" in props
        ? buttonVariants({
            className: props.className,
            variant: props.variant,
            size: props.size,
          })
        : linkVariants({
            className: props.className,
            variant: props.variant,
            size: props.size,
          });
    return <NextLink ref={ref} {...props} className={classes} />;
  }
);

Link.displayName = "Link";

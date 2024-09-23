import React from "react";

import { ComponentConfig } from "@measured/puck";
import { Section } from "../../components/Section";
import { cva } from "class-variance-authority";
import {
  TextDefaults,
  TextFields,
  TextProps,
  TextVariants,
} from "../../props/text";
import { PaddingFields } from "../../props/component/padding";
import {
  ComponentClasses,
  ComponentDefaults,
  ComponentFields,
  ComponentProps,
  ComponentStyles,
  ComponentVariants,
} from "../../props/component";

export const HeadingClasses = cva([], {
  variants: {
    ...ComponentVariants,
    ...TextVariants,
  },
});

export type HeadingProps = ComponentProps &
  TextProps & {
    text?: string;
    level?: "1" | "2" | "3" | "4" | "5" | "6";
  };

export const HeadingInternal = ({
  children,
  level,
  ...rest
}: React.PropsWithChildren<Omit<HeadingProps, "text">>) => {
  const Tag: any = level ? `h${level}` : "span";

  return (
    <Tag
      className={HeadingClasses({ ...rest, className: ComponentClasses(rest) })}
      style={ComponentStyles(rest)}
    >
      {children}
    </Tag>
  );
};

const levelOptions = [
  { label: "", value: "" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
];

export const Heading: ComponentConfig<HeadingProps> = {
  fields: {
    text: {
      type: "textarea",
      label: "Text",
    },
    level: {
      type: "select",
      label: "Header level",
      options: levelOptions,
    },
    ...TextFields,
    ...ComponentFields,
  },
  defaultProps: {
    text: "Heading",
    level: "2",
    ...TextDefaults,
    ...ComponentDefaults,
  },
  render: ({ text, level, ...rest }) => {
    return (
      <Section>
        <HeadingInternal level={level as any} {...rest}>
          {text}
        </HeadingInternal>
      </Section>
    );
  },
};

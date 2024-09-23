import React, { CSSProperties } from "react";

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

export const TextClasses = cva([], {
  variants: {
    ...ComponentVariants,
    ...TextVariants,
  },
});

export type TextComponentProps = ComponentProps &
  TextProps & {
    text?: string;
  };

export const Text: ComponentConfig<TextComponentProps> = {
  fields: {
    text: {
      type: "textarea",
      label: "Text",
    },
    ...TextFields,
    ...ComponentFields,
  },
  defaultProps: {
    text: "Text",
    ...TextDefaults,
    ...ComponentDefaults,
  },
  render: ({ text, ...rest }) => {
    return (
      <Section
        className={TextClasses({
          ...rest,
          className: ComponentClasses(rest),
        })}
        style={ComponentStyles(rest) as CSSProperties}
      >
        {text?.split("\n").map((t) => (
          <p>{t}</p>
        ))}
      </Section>
    );
  },
};

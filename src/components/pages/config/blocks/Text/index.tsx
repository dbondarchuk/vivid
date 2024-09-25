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
import {
  RichTextField,
  RichTextFieldRender,
  RichTextFieldType,
} from "@/components/pages/fields/rich-text-editor";

export const TextClasses = cva([], {
  variants: {
    ...ComponentVariants,
    ...TextVariants,
  },
});

export type TextComponentProps = ComponentProps &
  TextProps & {
    text: RichTextFieldType;
  };

export const Text: ComponentConfig<TextComponentProps> = {
  fields: {
    text: RichTextField,
    ...TextFields,
    ...ComponentFields,
  },
  defaultProps: {
    ...TextDefaults,
    ...ComponentDefaults,
  },
  render: ({ text, puck, ...rest }) => {
    return (
      <Section
        className={TextClasses({
          ...rest,
          className: ComponentClasses(rest),
        })}
        style={ComponentStyles(rest) as CSSProperties}
      >
        <RichTextFieldRender
          id={rest.id}
          isEditing={puck.isEditing}
          state={text}
        />
      </Section>
    );
  },
};

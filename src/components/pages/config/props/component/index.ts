import { ComponentConfig } from "@measured/puck";
import {
  ClassNameClasses,
  ClassNameDefaults,
  ClassNameFields,
  ClassNameProps,
} from "./className";
import {
  PaddingClasses,
  PaddingDefaults,
  PaddingFields,
  PaddingProps,
  PaddingStyles,
  PaddingVariants,
} from "./padding";

export type ComponentProps = PaddingProps & ClassNameProps;

export const ComponentFields: ComponentConfig<ComponentProps>["fields"] = {
  ...PaddingFields,
  ...ClassNameFields,
} as const;

export const ComponentVariants = {
  ...PaddingVariants,
};

export const ComponentDefaults = {
  ...PaddingDefaults,
  ...ClassNameDefaults,
};

export const ComponentStyles = (props: ComponentProps) => ({
  ...PaddingStyles(props),
});

export const ComponentClasses = (props: ComponentProps) => [
  ...PaddingClasses(props),
  ...ClassNameClasses(props),
];

import { ComponentConfig } from "@measured/puck";
import {
  TextAlignDefaults,
  TextAlignField,
  TextAlignProps,
  TextAlignVariant,
} from "./align";
import { FontDefaults, FontField, FontProps, FontVariant } from "./font";
import {
  TextSizeDefaults,
  TextSizeField,
  TextSizeProps,
  TextSizeVariant,
} from "./size";
import {
  FontWeightDefaults,
  FontWeightField,
  FontWeightProps,
  FontWeightVariant,
} from "./weight";

export type TextProps = TextAlignProps &
  TextSizeProps &
  FontProps &
  FontWeightProps;

export const TextFields: ComponentConfig<TextProps>["fields"] = {
  ...TextAlignField,
  ...TextSizeField,
  ...FontField,
  ...FontWeightField,
} as const;

export const TextVariants = {
  ...TextAlignVariant,
  ...TextSizeVariant,
  ...FontVariant,
  ...FontWeightVariant,
};

export const TextDefaults = {
  ...TextAlignDefaults,
  ...TextSizeDefaults,
  ...FontDefaults,
  ...FontWeightDefaults,
};

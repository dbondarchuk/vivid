import { DefaultHeadingLevel, type HeadingProps } from "./schema";

import { DefaultCSSProperties } from "../../style/css-renderer";
import { ALL_STYLES, AllStylesSchemas } from "../../style/styles";
import { getStylesSchema } from "../../style/utils";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);

export function getFontSize(
  level: NonNullable<NonNullable<HeadingProps["props"]>["level"]>
) {
  switch (level) {
    case "h1":
      return 2;
    case "h2":
      return 1.5;
    case "h3":
      return 1.25;
    case "h4":
      return 1;
    case "h5":
      return 0.875;
    case "h6":
      return 0.75;
  }
}

export const getDefaults = (
  { props, style }: HeadingProps,
  isEditor?: boolean
): DefaultCSSProperties<AllStylesSchemas> => ({
  fontWeight: "bold",
  textAlign: "center",
  fontSize: {
    value: getFontSize(props?.level || DefaultHeadingLevel),
    unit: "rem",
  },
});

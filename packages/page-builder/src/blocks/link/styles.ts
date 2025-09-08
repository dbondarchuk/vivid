import { type LinkProps } from "./schema";

import { DefaultCSSProperties } from "../../style/css-renderer";
import { ALL_STYLES, AllStylesSchemas } from "../../style/styles";
import { getStylesSchema } from "../../style/utils";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);

export const getDefaults = (
  { props, style }: LinkProps,
  isEditor?: boolean,
): DefaultCSSProperties<AllStylesSchemas> => {
  return {
    fontSize: { value: 1, unit: "rem" },
    fontWeight: "normal",
    textAlign: "left",
    textDecoration: "underline",
    display: "block",
    width: "max-content",
  };
};

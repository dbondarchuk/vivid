import { type IconProps } from "./schema";

import { DefaultCSSProperties } from "../../style/css-renderer";
import { ALL_STYLES, AllStylesSchemas } from "../../style/styles";
import { getStylesSchema } from "../../style/utils";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);

export const getDefaults = (
  { props, style }: IconProps,
  isEditor?: boolean
): DefaultCSSProperties<AllStylesSchemas> => {
  return {
    display: "block",
  };
};

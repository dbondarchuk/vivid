import { type ImageProps } from "./schema";

import { DefaultCSSProperties } from "../../style/css-renderer";
import { getAllStylesWithAdditionalStyles } from "../../style/styles";
import { objectFitStyle } from "../../style/styles/layout/object-fit";
import { objectPositionStyle } from "../../style/styles/layout/object-position";
import { getStylesSchema } from "../../style/utils";

export const styles = getAllStylesWithAdditionalStyles({
  objectFit: objectFitStyle,
  objectPosition: objectPositionStyle,
});

export const zStyles = getStylesSchema(styles);
export type ImageStylesSchema = {
  [key in keyof typeof styles]: (typeof styles)[key]["schema"];
};

export const getDefaults = (
  { props, style }: ImageProps,
  isEditor?: boolean
): DefaultCSSProperties<ImageStylesSchema> => ({
  display: "inline-block",
  textDecoration: "none",
  objectFit: "cover",
  objectPosition: { x: 50, y: 50 },
  verticalAlign: "middle",
  maxWidth: {
    value: 100,
    unit: "%",
  },
});

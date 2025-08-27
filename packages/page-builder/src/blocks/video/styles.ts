import { type VideoProps } from "./schema";

import { getStylesSchema } from "../../style";
import { DefaultCSSProperties } from "../../style/css-renderer";
import { ALL_STYLES, AllStylesSchemas } from "../../style/styles";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);
export type VideoStylesSchema = AllStylesSchemas;

export const getDefaults = (
  { props, style }: VideoProps,
  isEditor?: boolean,
): DefaultCSSProperties<VideoStylesSchema> => ({
  display: "inline-block",
  maxWidth: {
    value: 100,
    unit: "%",
  },
});

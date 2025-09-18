import { type YouTubeVideoProps } from "./schema";

import { getStylesSchema } from "../../style";
import { DefaultCSSProperties } from "../../style/css-renderer";
import { ALL_STYLES, AllStylesSchemas } from "../../style/styles";

export const styles = ALL_STYLES;
export const zStyles = getStylesSchema(styles);
export type YouTubeVideoStylesSchema = AllStylesSchemas;

export const getDefaults = (
  { props, style }: YouTubeVideoProps,
  isEditor?: boolean,
): DefaultCSSProperties<YouTubeVideoStylesSchema> => ({
  display: "inline-block",
  maxWidth: {
    value: 100,
    unit: "%",
  },
  position: "relative",
  padding: {
    left: {
      value: 0,
      unit: "px",
    },
    right: {
      value: 0,
      unit: "px",
    },
    top: {
      value: 0,
      unit: "px",
    },
    bottom: {
      value: 56.25,
      unit: "%",
    },
  },
});

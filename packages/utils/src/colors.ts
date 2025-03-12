import { StylingConfiguration } from "@vivid/types";
import Color from "color";

export const getColorsCss = (
  colors?: StylingConfiguration["colors"],
  prefix?: string
) => {
  return (colors || [])
    .filter((color) => !!color.value)
    .map(({ type, value }) => {
      const color = Color(value).hsl().object();
      return `--${prefix ? `${prefix}-` : ""}${type}-color: ${color.h.toFixed(1)} ${color.s.toFixed(1)}% ${color.l.toFixed(1)}%;`;
    })
    .join("\n");
};

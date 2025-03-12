import { FONT_FAMILIES } from "./font-family";
import { FontFamily, Padding } from "./zod";

export const getPadding = (padding: Padding | undefined | null) =>
  padding
    ? `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`
    : undefined;

export const getFontFamily = (font?: FontFamily) =>
  FONT_FAMILIES.find((f) => f.key === font)?.value || "inherit";

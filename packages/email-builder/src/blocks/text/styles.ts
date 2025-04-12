import { CSSProperties } from "react";
import { getFontFamily, getPadding } from "../../style-inputs/helpers/styles";
import { TextProps } from "./schema";

export const getStyles = ({ style }: TextProps): CSSProperties => ({
  color: style?.color ?? undefined,
  backgroundColor: style?.backgroundColor ?? undefined,
  fontSize: style?.fontSize ?? undefined,
  fontFamily: getFontFamily(style?.fontFamily),
  fontWeight: style?.fontWeight ?? undefined,
  textAlign: style?.textAlign ?? undefined,
  padding: getPadding(style?.padding),
});

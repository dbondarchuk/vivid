import type { CSSProperties } from "react";
import { getFontFamily, getPadding } from "../../style-inputs/helpers/styles";
import { HeadingPropsDefaults, type HeadingProps } from "./schema";

export function getFontSize(level: "h1" | "h2" | "h3") {
  switch (level) {
    case "h1":
      return 32;
    case "h2":
      return 24;
    case "h3":
      return 20;
  }
}

export const getStyles = ({ props, style }: HeadingProps): CSSProperties => ({
  color: style?.color ?? undefined,
  backgroundColor: style?.backgroundColor ?? undefined,
  fontWeight: style?.fontWeight ?? "bold",
  textAlign: style?.textAlign ?? undefined,
  margin: 0,
  fontFamily: getFontFamily(style?.fontFamily),
  fontSize:
    style?.fontSize ||
    getFontSize(props?.level || HeadingPropsDefaults.props.level),
  padding: getPadding(style?.padding),
});

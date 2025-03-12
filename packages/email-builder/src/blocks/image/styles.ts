import React from "react";
import { getPadding } from "../../style-inputs/helpers/styles";
import { ImageProps, ImagePropsDefaults } from "./schema";

export const getWrapperStyles = ({
  style,
}: ImageProps): React.CSSProperties => ({
  padding: getPadding(style?.padding),
  backgroundColor: style?.backgroundColor ?? undefined,
  textAlign: style?.textAlign ?? undefined,
});

export const getImageStyles = ({ props }: ImageProps): React.CSSProperties => ({
  outline: "none",
  border: "none",
  textDecoration: "none",
  verticalAlign: props?.contentAlignment ?? "middle",
  display: "inline-block",
  objectFit: "cover",
  maxWidth: "100%",
  objectPosition: `${props?.x ?? ImagePropsDefaults.props.x}% ${props?.y ?? ImagePropsDefaults.props.y}%`,
});

import { CSSProperties, JSX } from "react";
import { ContainerProps } from "./schema";
import { getPadding } from "../../style-inputs/helpers/styles";

function getBorder(style: ContainerProps["style"]) {
  if (!style || !style.borderColor) {
    return undefined;
  }
  return `1px solid ${style.borderColor}`;
}

export const BaseContainer = ({
  style,
  children,
}: Omit<ContainerProps, "props"> & {
  children: JSX.Element | JSX.Element[] | null;
}) => {
  const wStyle: CSSProperties = {
    backgroundColor: style?.backgroundColor ?? undefined,
    border: getBorder(style),
    borderRadius: style?.borderRadius ?? undefined,
    padding: getPadding(style?.padding),
  };

  if (!children) {
    return <div style={wStyle} />;
  }
  return <div style={wStyle}>{children}</div>;
};

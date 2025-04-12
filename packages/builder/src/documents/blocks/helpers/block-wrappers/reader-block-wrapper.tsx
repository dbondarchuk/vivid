import React from "react";

import { TStyle } from "../TStyle";

type TReaderBlockWrapperProps = {
  style: TStyle;
  children: React.JSX.Element;
};

export const ReaderBlockWrapper: React.FC<TReaderBlockWrapperProps> = ({
  style,
  children,
}) => {
  const { padding, borderColor, ...restStyle } = style;
  const cssStyle: React.CSSProperties = {
    ...restStyle,
  };

  if (padding) {
    const { top, bottom, left, right } = padding;
    cssStyle.padding = `${top}px ${right}px ${bottom}px ${left}px`;
  }

  if (borderColor) {
    cssStyle.border = `1px solid ${borderColor}`;
  }

  return <div style={{ maxWidth: "100%", ...cssStyle }}>{children}</div>;
};

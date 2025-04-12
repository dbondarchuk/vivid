import React from "react";
import { getPadding } from "../../style-inputs/helpers/styles";
import { DividerProps, DividerPropsDefaults } from "./schema";

export const Divider = ({ style, props }: DividerProps) => {
  const st: React.CSSProperties = {
    padding: getPadding(style?.padding),
    backgroundColor: style?.backgroundColor ?? undefined,
  };
  const borderTopWidth =
    props?.lineHeight ?? DividerPropsDefaults.props.lineHeight;
  const borderTopColor =
    props?.lineColor ?? DividerPropsDefaults.props.lineColor;
  return (
    <div style={st}>
      <hr
        style={{
          width: "100%",
          border: "none",
          borderTop: `${borderTopWidth}px solid ${borderTopColor}`,
          margin: 0,
        }}
      />
    </div>
  );
};

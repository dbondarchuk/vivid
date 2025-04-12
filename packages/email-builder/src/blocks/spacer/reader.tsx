import { CSSProperties } from "react";
import { SpacerProps, SpacerPropsDefaults } from "./schema";

export const Spacer = ({ props, style }: SpacerProps) => {
  const styles: CSSProperties = {
    height: props?.height ?? SpacerPropsDefaults.props.height,
    backgroundColor: style?.backgroundColor ?? undefined,
  };

  return <div style={styles} />;
};

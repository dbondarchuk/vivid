import React, { CSSProperties, JSX, ReactElement } from "react";

import { template } from "@vivid/utils";
import { useReaderArgs } from "../../../reader/context";
import { TStyle } from "../TStyle";

type TReaderBlockWrapperProps = {
  style: TStyle;
  children: JSX.Element;
};

export default function ReaderBlockWrapper({
  style,
  children,
}: TReaderBlockWrapperProps) {
  const { padding, borderColor, ...restStyle } = style;
  const cssStyle: CSSProperties = {
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
}

const recursiveLoop = (data: any, modifier: (value: string) => string): any => {
  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      recursiveLoop(data[i], modifier);
    }
  } else if (typeof data === "object" && data !== null) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        if (typeof data[key] === "string") {
          data[key] = modifier(data[key]);
        } else {
          recursiveLoop(data[key], modifier); // Recursive call for nested objects/arrays
        }
      }
    }
  }
};

export const templateProps = (props: any) => {
  const args = useReaderArgs();
  const newProps = JSON.parse(JSON.stringify(props));
  recursiveLoop(newProps, (value) => template(value, args, true));

  return newProps;
};

export const WithMustacheModifiedProps = ({
  children,
}: {
  children: ReactElement;
}) => {
  const args = useReaderArgs();
  return React.cloneElement(
    children,
    recursiveLoop(JSON.parse(JSON.stringify(children.props)), (value) =>
      template(value, args, true)
    )
  );
};

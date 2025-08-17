import { CSSProperties } from "react";
import { stringifyCSSProperties } from "react-style-stringify";

export const getCss = (id: string, styleObject: CSSProperties) => {
  const keys = Object.keys(styleObject);
  for (const key of keys) {
    // @ts-ignore magic to remove undefined values
    if (typeof styleObject[key] === "undefined") delete styleObject[key];
  }

  return `#${id} { ${stringifyCSSProperties(styleObject)} }`;
};

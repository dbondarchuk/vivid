import React from "react";

import { spacingOptions } from "../../options";
import { ComponentConfig } from "@measured/puck";

export type VerticalSpaceProps = {
  size: string;
};

export const VerticalSpace: ComponentConfig<VerticalSpaceProps> = {
  label: "Vertical Space",
  fields: {
    size: {
      type: "select",
      options: spacingOptions,
    },
  },
  defaultProps: {
    size: "24px",
  },
  render: ({ size }) => {
    return <div style={{ height: size, width: "100%" }} />;
  },
};

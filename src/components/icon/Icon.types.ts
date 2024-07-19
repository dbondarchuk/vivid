import React, { SVGProps } from "react";
import { Icons } from "./CustomIcons";

export type IconType = keyof typeof Icons;

export interface IconProps
  extends Omit<React.HTMLProps<SVGSVGElement>, "size" | "children"> {
  name: IconType;
  size?: string | number;
  iconStyle?: "round" | "outlined";
  label?: string;
  viewBox?: string;
  className?: string;
  children?: React.ReactElement<SVGProps<SVGSVGElement>>;
}

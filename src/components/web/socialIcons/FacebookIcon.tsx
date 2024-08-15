import React from "react";
import Link from "next/link";
import { Icon } from "../icon/Icon";
import { SocialIconProps } from "./SocialIcons.types";

export const FacebookIcon: React.FC<SocialIconProps> = ({
  value,
  ...props
}) => {
  return (
    <Link
      href={`https://facebook.com/${value}`}
      target="_blank"
      aria-label={`Facebook - ${value}`}
    >
      <Icon size={24} {...props} name="facebook" />
    </Link>
  );
};

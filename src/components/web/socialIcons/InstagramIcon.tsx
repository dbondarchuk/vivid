import React from "react";
import Link from "next/link";
import { Icon } from "../icon/Icon";
import { SocialIconProps } from "./SocialIcons.types";

export const InstagramIcon: React.FC<SocialIconProps> = ({
  value,
  ...props
}) => {
  return (
    <Link
      href={`https://instagram.com/${value}`}
      target="_blank"
      aria-label={`Instagram - ${value}`}
    >
      <Icon size={24} {...props} name="instagram" />
    </Link>
  );
};

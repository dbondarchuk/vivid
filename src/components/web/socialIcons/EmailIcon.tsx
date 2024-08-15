import React from "react";
import Link from "next/link";
import { Icon } from "../icon/Icon";
import { SocialIconProps } from "./SocialIcons.types";

export const EmailIcon: React.FC<SocialIconProps> = ({ value, ...props }) => {
  return (
    <Link href={`mailto:${value}`} aria-label="Send email">
      <Icon size={24} {...props} name="mail" />
    </Link>
  );
};

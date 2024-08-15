import React from "react";
import Link from "next/link";
import { Icon } from "../icon/Icon";
import { SocialIconProps } from "./SocialIcons.types";

export const PhoneIcon: React.FC<SocialIconProps> = ({ value, ...props }) => {
  return (
    <Link href={`tel:${value}`} aria-label="Give us a call">
      <Icon size={24} {...props} name="phone" />
    </Link>
  );
};

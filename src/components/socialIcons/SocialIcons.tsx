import React from "react";
import { IconProps } from "../icon/Icon.types";
import { EmailIcon } from "./EmailIcon";
import { FacebookIcon } from "./FacebookIcon";
import { InstagramIcon } from "./InstagramIcon";
import { PhoneIcon } from "./PhoneIcon";
import { SocialIconProps } from "./SocialIcons.types";

const getIcon = (icon: string, iconProps?: Omit<IconProps, "name">) => {
  switch (icon) {
    case "instagram":
      return <InstagramIcon {...iconProps} />;
    case "facebook":
      return <FacebookIcon {...iconProps} />;
    case "email":
      return <EmailIcon {...iconProps} />;
    case "phone":
      return <PhoneIcon {...iconProps} />;
  }
};

export const SocialIcons: React.FC<SocialIconProps> = ({
  icons = ["instagram", "facebook", "email", "phone"],
  iconProps,
}) => {
  return (
    <nav className="flex flex-row gap-4">
      {icons.map((icon) => {
        return (
          <React.Fragment key={icon}>{getIcon(icon, iconProps)}</React.Fragment>
        );
      })}
    </nav>
  );
};

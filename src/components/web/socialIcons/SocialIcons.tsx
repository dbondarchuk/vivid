import React from "react";
import { IconProps } from "../icon/Icon.types";
import { EmailIcon } from "./EmailIcon";
import { FacebookIcon } from "./FacebookIcon";
import { InstagramIcon } from "./InstagramIcon";
import { PhoneIcon } from "./PhoneIcon";
import { SocialIconOtherProps, SocialIconsProps } from "./SocialIcons.types";

const getIcon = (
  icon: string,
  value: string,
  iconProps?: SocialIconOtherProps
) => {
  switch (icon) {
    case "instagram":
      return <InstagramIcon value={value} {...iconProps} />;
    case "facebook":
      return <FacebookIcon value={value} {...iconProps} />;
    case "email":
      return <EmailIcon value={value} {...iconProps} />;
    case "phone":
      return <PhoneIcon value={value} {...iconProps} />;
  }
};

export const SocialIcons: React.FC<SocialIconsProps> = ({
  icons,
  iconProps,
}) => {
  if (!icons) return null;

  return (
    <nav className="flex flex-row gap-4">
      {Object.entries(icons).map(([icon, value]) => {
        if (!value) return null;
        return (
          <React.Fragment key={icon}>
            {getIcon(icon, value, iconProps)}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

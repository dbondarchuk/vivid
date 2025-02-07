import { SocialLink } from "@vivid/types";
import { IconProps } from "../icon/types";

export type SocialIconOtherProps = Omit<IconProps, "name" | "value">;

export type SocialIconsProps = {
  icons?: SocialLink[];
  iconProps?: SocialIconOtherProps;
};

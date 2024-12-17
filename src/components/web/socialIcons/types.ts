import { SocialLink } from "@/types";
import { IconProps } from "../icon/Icon.types";

export type SocialIconOtherProps = Omit<IconProps, "name" | "value">;

export type SocialIconsProps = {
  icons?: SocialLink[];
  iconProps?: SocialIconOtherProps;
};

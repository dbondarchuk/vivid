import { IconProps } from "../icon/Icon.types";

export type SocialIconType = "instagram" | "facebook" | "email" | "phone";

export type SocialIconOtherProps = Omit<IconProps, "name" | "value">;

export type SocialIconProps = SocialIconOtherProps & {
  value: string;
};

export type SocialIconsProps = {
  icons?: Partial<Record<SocialIconType, string | undefined>>;
  iconProps?: SocialIconOtherProps;
};

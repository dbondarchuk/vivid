import { IconProps } from "../icon/Icon.types";

export type SocialIconProps = {
  icons?: ("instagram" | "facebook" | "email" | "phone")[];
  iconProps?: Omit<IconProps, "name">;
};

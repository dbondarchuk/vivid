import Link from "next/link";
import { Icon } from "../icon/Icon";
import { IconProps } from "../icon/Icon.types";

export const FacebookIcon = (props: Omit<IconProps, "name">) => {
  return (
    <Link href="https://facebook.com/vividnail.studio">
      <Icon
        size={24}
        aria-label="Facebook - vividnail.studio"
        {...props}
        name="facebook"
      />
    </Link>
  );
};

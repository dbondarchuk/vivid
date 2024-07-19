import Link from "next/link";
import { Icon } from "../icon/Icon";
import { IconProps } from "../icon/Icon.types";

export const InstagramIcon = (props: Omit<IconProps, "name">) => {
  return (
    <Link href="https://instagram.com/vividnail.studio">
      <Icon
        size={24}
        aria-label="Instagram - vividnail.studio"
        {...props}
        name="instagram"
      />
    </Link>
  );
};

import Link from "next/link";
import { Icon } from "../icon/Icon";
import { IconProps } from "../icon/Icon.types";

export const PhoneIcon = (props: Omit<IconProps, "name">) => {
  return (
    <Link href="tel:+19842913494">
      <Icon
        size={24}
        aria-label="Give a call to Viviv Nail Studio"
        {...props}
        name="phone"
      />
    </Link>
  );
};

import Link from "next/link";
import { Icon } from "../icon/Icon";
import { IconProps } from "../icon/Icon.types";

export const EmailIcon = (props: Omit<IconProps, "name">) => {
  return (
    <Link href="mailto:olesia@vividnail.studio">
      <Icon size={24} aria-label="Send mail" {...props} name="mail" />
    </Link>
  );
};

import { icons, Icon as LucidIcon } from "lucide-react";

export type IconProps = Omit<
  React.ComponentPropsWithoutRef<typeof LucidIcon>,
  "iconNode"
> & {
  name: keyof typeof icons;
};

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;

  return <LucideIcon {...props} />;
};

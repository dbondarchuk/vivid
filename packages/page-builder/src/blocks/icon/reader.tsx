import { cn } from "@vivid/ui";
import { icons } from "lucide-react";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { IconPropsDefaults, IconReaderProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const Icon = ({ props, style, block }: IconReaderProps) => {
  const iconName = props?.icon ?? IconPropsDefaults.props.icon;
  const defaults = getDefaults({ props, style }, false);

  const className = generateClassName();
  const base = block.base;

  // Get the icon component from Lucide
  const IconComponent = icons[iconName as keyof typeof icons];

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
      />
      <IconComponent className={cn(className, base?.className)} id={base?.id} />
    </>
  );
};

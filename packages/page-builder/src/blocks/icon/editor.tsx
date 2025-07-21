"use client";

import { useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { icons } from "lucide-react";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { IconProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const IconEditor = ({ props, style }: IconProps) => {
  const currentBlock = useCurrentBlock<IconProps>();
  const iconName = (currentBlock?.data?.props as any)?.icon ?? "Star";
  const base = currentBlock?.base;

  const className = generateClassName();
  const defaults = getDefaults({ props, style }, true);

  // Get the icon component from Lucide
  const IconComponent = icons[iconName as keyof typeof icons];

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor
      />
      <IconComponent className={cn(className, base?.className)} />
    </>
  );
};

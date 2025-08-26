"use client";

import { useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { CustomHTMLProps } from "./schema";
import { getDefaults, styles } from "./styles";

export const CustomHTMLEditor = ({ props, style }: CustomHTMLProps) => {
  const currentBlock = useCurrentBlock<CustomHTMLProps>();
  const html = (currentBlock?.data?.props as any)?.html ?? "";
  const base = currentBlock?.base;

  const className = useClassName();
  const defaults = getDefaults({ props, style }, true);

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={style}
        defaults={defaults}
        isEditor
      />

      <div
        className={cn(className, base?.className)}
        id={base?.id}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

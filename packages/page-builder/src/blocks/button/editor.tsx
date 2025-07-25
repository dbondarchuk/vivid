"use client";

import { EditorBlock, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { ButtonProps } from "./schema";
import { getDefaults, styles } from "./styles";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const ButtonEditor = ({ props, style }: ButtonProps) => {
  const currentBlock = useCurrentBlock<ButtonProps>();
  const content = currentBlock?.data?.props?.children?.[0];
  const base = currentBlock.base;

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
      <span className={cn(className, base?.className)} id={base?.id}>
        {content && (
          <EditorBlock key={content?.id} block={content} {...disable} />
        )}
      </span>
    </>
  );
};

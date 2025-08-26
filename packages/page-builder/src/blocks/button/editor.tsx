"use client";

import {
  EditorBlock,
  useBlockChildrenBlockIds,
  useCurrentBlock,
  useSetCurrentBlockRef,
} from "@vivid/builder";
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
  const contentId = useBlockChildrenBlockIds(currentBlock.id, "props")?.[0];

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
      <div className={cn(className, base?.className)} id={base?.id}>
        {!!contentId && (
          <EditorBlock
            key={contentId}
            blockId={contentId}
            {...disable}
            index={0}
            parentBlockId={currentBlock.id}
            parentProperty="content"
            allowedTypes="SimpleContainer"
          />
        )}
      </div>
    </>
  );
};

"use client";

import {
  EditorBlock,
  useBlockChildrenBlockIds,
  useBlockEditor,
  useCurrentBlock,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { useResizeBlockStyles } from "../../helpers/use-resize-block-styles";
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
  const onResize = useResizeBlockStyles();
  const overlayProps = useBlockEditor(currentBlock.id, onResize);
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
      <span
        className={cn(className, base?.className)}
        id={base?.id}
        {...overlayProps}
      >
        {!!contentId && (
          <EditorBlock
            key={contentId}
            blockId={contentId}
            {...disable}
            index={0}
            parentBlockId={currentBlock.id}
            parentProperty="content"
            allowedTypes="InlineContainer"
          />
        )}
      </span>
    </>
  );
};

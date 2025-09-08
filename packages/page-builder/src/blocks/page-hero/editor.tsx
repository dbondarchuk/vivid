"use client";

import {
  EditorBlock,
  useBlockChildrenBlockIds,
  useCurrentBlock,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { PageHeroProps } from "./schema";
import { styles } from "./styles";

const disable = {
  disableMove: true,
  disableDelete: true,
  disableClone: true,
  disableDrag: true,
};

export const PageHeroEditor = ({ props, style }: PageHeroProps) => {
  const currentBlock = useCurrentBlock<PageHeroProps>();

  const titleId = useBlockChildrenBlockIds(currentBlock.id, "props.title")?.[0];
  const subtitleId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.subtitle",
  )?.[0];
  const buttonsId = useBlockChildrenBlockIds(
    currentBlock.id,
    "props.buttons",
  )?.[0];
  const className = useClassName();
  const base = currentBlock?.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <section className={cn(className, base?.className)} id={base?.id}>
        {!!titleId && (
          <EditorBlock
            blockId={titleId}
            {...disable}
            index={0}
            parentBlockId={currentBlock.id}
            parentProperty="title"
            allowedTypes="Heading"
          />
        )}
        {!!subtitleId && (
          <EditorBlock
            blockId={subtitleId}
            {...disable}
            index={0}
            parentBlockId={currentBlock.id}
            parentProperty="subtitle"
            allowedTypes="Heading"
          />
        )}
        {!!buttonsId && (
          <EditorBlock
            blockId={buttonsId}
            {...disable}
            index={0}
            parentBlockId={currentBlock.id}
            parentProperty="buttons"
          />
        )}
      </section>
    </>
  );
};

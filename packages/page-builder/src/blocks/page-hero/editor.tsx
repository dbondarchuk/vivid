"use client";

import { EditorBlock, useCurrentBlock } from "@vivid/builder";
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

  const title = currentBlock.data?.props?.title?.children?.[0];
  const subtitle = currentBlock.data?.props?.subtitle?.children?.[0];
  const buttons = currentBlock.data?.props?.buttons?.children?.[0];
  const className = useClassName();
  const base = currentBlock?.base;

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <section className={cn(className, base?.className)} id={base?.id}>
        {title && <EditorBlock block={title} {...disable} />}
        {subtitle && <EditorBlock block={subtitle} {...disable} />}
        {buttons && <EditorBlock block={buttons} {...disable} />}
      </section>
    </>
  );
};

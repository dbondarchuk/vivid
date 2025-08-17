"use client";

import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { useClassName } from "../../helpers/use-class-name";
import { BlockStyle } from "../../helpers/styling";
import { AccordionProps } from "./schema";
import { styles } from "./styles";

export const AccordionEditor = ({ props, style }: AccordionProps) => {
  const currentBlock = useCurrentBlock<AccordionProps>();

  const children = currentBlock.data?.props?.children || [];
  const className = useClassName();
  const base = currentBlock.base;

  // Pass animation properties to accordion items
  const additionalProps = {
    animation: currentBlock.data?.props?.animation,
    iconPosition: currentBlock.data?.props?.iconPosition,
    iconStyle: currentBlock.data?.props?.iconStyle,
  };

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children}
        className={cn(className, base?.className)}
        id={base?.id}
        allowOnly="AccordionItem"
        additionalProps={additionalProps}
      />
    </>
  );
};

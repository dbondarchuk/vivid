"use client";

import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { cn } from "@vivid/ui";
import { useMemo } from "react";
import { BlockStyle } from "../../helpers/styling";
import { useClassName } from "../../helpers/use-class-name";
import { AccordionProps } from "./schema";
import { styles } from "./styles";

export const AccordionEditor = ({ props, style }: AccordionProps) => {
  const currentBlock = useCurrentBlock<AccordionProps>();

  const className = useClassName();
  const base = currentBlock.base;

  const animation = currentBlock.data?.props?.animation;
  const iconPosition = currentBlock.data?.props?.iconPosition;
  const iconStyle = currentBlock.data?.props?.iconStyle;

  // Pass animation properties to accordion items
  const additionalProps = useMemo(
    () => ({
      animation,
      iconPosition,
      iconStyle,
    }),
    [animation, iconPosition, iconStyle]
  );

  return (
    <>
      <BlockStyle
        name={className}
        styleDefinitions={styles}
        styles={currentBlock.data?.style}
      />
      <EditorChildren
        blockId={currentBlock.id}
        property="props"
        className={cn(className, base?.className)}
        id={base?.id}
        allowOnly="AccordionItem"
        additionalProps={additionalProps}
      />
    </>
  );
};

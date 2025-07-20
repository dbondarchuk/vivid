"use client";

import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { AccordionProps } from "./schema";
import { styles } from "./styles";

export const AccordionEditor = ({ props, style }: AccordionProps) => {
  const currentBlock = useCurrentBlock<AccordionProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children || [];
  const className = generateClassName();
  const base = currentBlock.base;

  // Pass animation properties to accordion items
  const additionalProps = {
    animation: props.animation,
    iconPosition: props.iconPosition,
    iconStyle: props.iconStyle,
  };

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <EditorChildren
        block={currentBlock}
        property="props.children"
        children={children}
        className={cn(className, base?.className)}
        id={base?.id}
        allowOnly="AccordionItem"
        additionalProps={additionalProps}
        onChange={({ block, blockId, children }) => {
          dispatchAction({
            type: "set-block-data",
            value: {
              blockId: currentBlock.id,
              data: {
                ...currentBlock.data,
                props: {
                  ...currentBlock.data?.props,
                  children,
                },
              },
            },
          });

          setSelectedBlockId(blockId);
        }}
      />
    </>
  );
};

import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { cn } from "@vivid/ui";
import React from "react";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { SimpleContainerProps, styles } from "./schema";

const ChildWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <span className={className}>{children}</span>;

export const SimpleContainerEditor = ({
  style,
  props,
}: SimpleContainerProps) => {
  const currentBlock = useCurrentBlock<SimpleContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;
  const className = generateClassName();
  const base = currentBlock.base;
  const allowOnly = React.useMemo(() => ["SimpleText", "Icon", "Link"], []);

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children || []}
        className={cn(className, base?.className)}
        childWrapper={ChildWrapper}
        hidePrefixAddBlockButton
        id={base?.id}
        addButtonSize="small"
        allowOnly={allowOnly}
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

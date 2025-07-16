import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { useId } from "react";
import { BlockStyle } from "../../helpers/styling";
import { ContainerProps, styles } from "./schema";
import { generateClassName } from "../../helpers/class-name-generator";
import { cn } from "@vivid/ui";

export const ContainerEditor = ({ style, props }: ContainerProps) => {
  const currentBlock = useCurrentBlock<ContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;
  const className = generateClassName();
  const base = currentBlock.base;
  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children || []}
        className={cn(className, base?.className)}
        id={base?.id}
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

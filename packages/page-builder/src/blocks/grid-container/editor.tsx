import {
    EditorChildren,
    useCurrentBlock,
    useDispatchAction,
    useSetSelectedBlockId,
} from "@vivid/builder";
import { generateClassName } from "../../helpers/class-name-generator";
import { BlockStyle } from "../../helpers/styling";
import { GridContainerProps, styles } from "./schema";

export const GridContainerEditor = ({ style, props }: GridContainerProps) => {
  const currentBlock = useCurrentBlock<GridContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;
  const className = generateClassName();

  return (
    <>
      <BlockStyle name={className} styleDefinitions={styles} styles={style} />
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children || []}
        hidePrefixAddBlockButton
        className={className}
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

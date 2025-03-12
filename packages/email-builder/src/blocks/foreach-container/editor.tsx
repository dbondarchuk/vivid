import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerEditor = ({ props }: ForeachContainerProps) => {
  const value = props?.value || "";

  const currentBlock = useCurrentBlock<ForeachContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        For each <em>_item</em> in <em>{value || "value"}</em>
      </div>
      <EditorChildren
        block={currentBlock}
        property="data.props"
        children={children || []}
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
    </div>
  );
};

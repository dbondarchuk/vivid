import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerEditor = ({ props }: ForeachContainerProps) => {
  const t = useI18n("builder");
  const value = props?.value || "";

  const currentBlock = useCurrentBlock<ForeachContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const children = currentBlock.data?.props?.children;

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t.rich(
          "emailBuilder.blocks.foreachContainer.forEachItemInValueFormat",
          {
            item: () => <em>_item</em>,
            value: value || t("emailBuilder.blocks.foreachContainer.value"),
          }
        )}
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

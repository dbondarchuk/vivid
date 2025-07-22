import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerEditor = ({ props }: ForeachContainerProps) => {
  const t = useI18n("builder");
  const currentBlock = useCurrentBlock<ForeachContainerProps>();
  const value = currentBlock.data?.props?.value || "";

  const children = currentBlock.data?.props?.children;

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t.rich(
          "pageBuilder.blocks.foreachContainer.forEachItemInValueFormat",
          {
            item: () => <em>_item</em>,
            value: () => <em>{value || "value"}</em>,
          }
        )}
      </div>
      <EditorChildren
        block={currentBlock}
        property="props"
        children={children || []}
      />
    </div>
  );
};

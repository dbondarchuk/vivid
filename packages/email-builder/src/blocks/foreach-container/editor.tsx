import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ForeachContainerProps } from "./schema";

export const ForeachContainerEditor = ({ props }: ForeachContainerProps) => {
  const t = useI18n("builder");

  const currentBlock = useCurrentBlock<ForeachContainerProps>();

  const value = currentBlock.data?.props?.value || "";

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t.rich(
          "emailBuilder.blocks.foreachContainer.forEachItemInValueFormat",
          {
            item: () => <em>_item</em>,
            value: value || t("emailBuilder.blocks.foreachContainer.value"),
          },
        )}
      </div>
      <EditorChildren blockId={currentBlock.id} property="props" />
    </div>
  );
};

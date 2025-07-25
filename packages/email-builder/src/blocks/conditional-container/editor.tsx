import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { ConditionalContainerProps } from "./schema";

export const ConditionalContainerEditor = ({
  props,
}: ConditionalContainerProps) => {
  const t = useI18n("builder");

  const currentBlock = useCurrentBlock<ConditionalContainerProps>();
  const condition = currentBlock.data?.props?.condition || "";

  const thenChildren = currentBlock.data?.props?.then?.children ?? [];
  const elseChildren = currentBlock.data?.props?.otherwise?.children ?? [];

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t.rich(
          "emailBuilder.blocks.conditionalContainer.ifConditionIsCorrectFormat",

          {
            condition:
              condition ||
              t("emailBuilder.blocks.conditionalContainer.condition"),
          }
        )}
      </div>
      <EditorChildren
        block={currentBlock}
        property="props.then"
        children={thenChildren}
      />
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t("emailBuilder.blocks.conditionalContainer.otherwise")},
      </div>
      <EditorChildren
        block={currentBlock}
        property="data.props.otherwise"
        children={elseChildren}
      />
    </div>
  );
};

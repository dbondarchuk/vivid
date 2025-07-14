import React from "react";

import { ConditionalContainerProps } from "./schema";
import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";

export const ConditionalContainerEditor = ({
  props,
}: ConditionalContainerProps) => {
  const condition = props?.condition || "";
  const t = useI18n("builder");

  const currentBlock = useCurrentBlock<ConditionalContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const thenChildren = currentBlock.data?.props?.then?.children ?? [];
  const elseChildren = currentBlock.data?.props?.otherwise?.children ?? [];

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t.rich(
          "pageBuilder.blocks.conditionalContainer.ifConditionIsCorrectFormat",
          {
            condition: () => (
              <em className="font-bold">
                {condition ||
                  t("pageBuilder.blocks.conditionalContainer.value")}
              </em>
            ),
          }
        )}
      </div>
      <EditorChildren
        block={currentBlock}
        property="props.then"
        children={thenChildren}
        onChange={({ block, blockId, children }) => {
          dispatchAction({
            type: "set-block-data",
            value: {
              blockId: currentBlock.id,
              data: {
                ...currentBlock.data,
                props: {
                  ...currentBlock.data?.props,
                  then: {
                    ...currentBlock.data?.props?.then,
                    children,
                  },
                },
              },
            },
          });

          setSelectedBlockId(blockId);
        }}
      />
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {t("pageBuilder.blocks.conditionalContainer.otherwise")}
      </div>
      <EditorChildren
        block={currentBlock}
        property="props.otherwise"
        children={elseChildren}
        onChange={({ block, blockId, children }) => {
          dispatchAction({
            type: "set-block-data",
            value: {
              blockId: currentBlock.id,
              data: {
                ...currentBlock.data,
                props: {
                  ...currentBlock.data?.props,
                  otherwise: {
                    ...currentBlock.data?.props?.otherwise,
                    children,
                  },
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

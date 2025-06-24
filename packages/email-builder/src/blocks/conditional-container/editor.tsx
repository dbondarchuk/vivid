import React from "react";

import { ConditionalContainerProps } from "./schema";
import {
  EditorChildren,
  useCurrentBlock,
  useDispatchAction,
  useSetSelectedBlockId,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { formatJsx } from "@vivid/ui";

export const ConditionalContainerEditor = ({
  props,
}: ConditionalContainerProps) => {
  const t = useI18n("builder");
  const condition = props?.condition || "";

  const currentBlock = useCurrentBlock<ConditionalContainerProps>();
  const dispatchAction = useDispatchAction();
  const setSelectedBlockId = useSetSelectedBlockId();

  const thenChildren = currentBlock.data?.props?.then?.children ?? [];
  const elseChildren = currentBlock.data?.props?.otherwise?.children ?? [];

  return (
    <div className="w-full">
      <div className="mb-2 text-muted-foreground text-xs w-full">
        {formatJsx(
          t(
            "emailBuilder.blocks.conditionalContainer.ifConditionIsCorrectFormat"
          ),
          {
            condition,
          }
        )}
      </div>
      <EditorChildren
        block={currentBlock}
        property="data.props.then"
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
        {t("emailBuilder.blocks.conditionalContainer.otherwise")},
      </div>
      <EditorChildren
        block={currentBlock}
        property="data.props.otherwise"
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

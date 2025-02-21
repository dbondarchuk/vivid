import React from "react";

import { Container as BaseContainer } from "@usewaypoint/block-container";

import { useCurrentBlockId } from "../../editor/block";
import {
  setDocument,
  setSelectedBlockId,
  useDocument,
} from "../../editor/context";
import EditorChildrenIds from "../helpers/editor-children-ids";

import { ConditionalContainerProps } from "./schema";

export default function ConditionalContainerEditor({
  props,
}: ConditionalContainerProps) {
  const thenChildrenIds = props?.then?.childrenIds ?? [];
  const otherwiseChildrenIds = props?.otherwise?.childrenIds ?? [];
  const condition = props?.condition || "";

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  return (
    <BaseContainer>
      <div className="mb-2 text-muted-foreground text-xs w-full">
        If condition <em>value</em> is <em>correct</em>, then
      </div>
      <EditorChildrenIds
        childrenIds={thenChildrenIds}
        onChange={({ block, blockId, childrenIds }) => {
          setDocument({
            [blockId]: block,
            [currentBlockId]: {
              type: "ConditionalContainer",
              data: {
                ...document[currentBlockId].data,
                props: {
                  ...props,
                  condition,
                  otherwise: { childrenIds: otherwiseChildrenIds },
                  then: { childrenIds },
                },
              },
            },
          });
          setSelectedBlockId(blockId);
        }}
      />
      <div className="mb-2 text-muted-foreground text-xs w-full">
        Otherwise,
      </div>
      <EditorChildrenIds
        childrenIds={otherwiseChildrenIds}
        onChange={({ block, blockId, childrenIds }) => {
          setDocument({
            [blockId]: block,
            [currentBlockId]: {
              type: "ConditionalContainer",
              data: {
                ...document[currentBlockId].data,
                props: {
                  ...props,
                  condition,
                  then: { childrenIds: thenChildrenIds },
                  otherwise: { childrenIds },
                },
              },
            },
          });
          setSelectedBlockId(blockId);
        }}
      />
    </BaseContainer>
  );
}

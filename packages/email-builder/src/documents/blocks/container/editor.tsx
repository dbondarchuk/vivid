import React from "react";

import { Container as BaseContainer } from "@usewaypoint/block-container";

import { useCurrentBlockId } from "../../editor/block";
import {
  setDocument,
  setSelectedBlockId,
  useDocument,
} from "../../editor/context";
import EditorChildrenIds from "../helpers/editor-children-ids";

import { ContainerProps } from "./schema";

export default function ContainerEditor({ style, props }: ContainerProps) {
  const childrenIds = props?.childrenIds ?? [];

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  return (
    <BaseContainer style={style}>
      <EditorChildrenIds
        childrenIds={childrenIds}
        onChange={({ block, blockId, childrenIds }) => {
          setDocument({
            [blockId]: block,
            [currentBlockId]: {
              type: "Container",
              data: {
                ...document[currentBlockId].data,
                props: { childrenIds: childrenIds },
              },
            },
          });
          setSelectedBlockId(blockId);
        }}
      />
    </BaseContainer>
  );
}

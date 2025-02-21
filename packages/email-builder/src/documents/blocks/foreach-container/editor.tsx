import { Container as BaseContainer } from "@usewaypoint/block-container";

import { useCurrentBlockId } from "../../editor/block";
import {
  setDocument,
  setSelectedBlockId,
  useDocument,
} from "../../editor/context";
import EditorChildrenIds from "../helpers/editor-children-ids";

import { ForeachContainerProps } from "./schema";

export default function ForeachContainerEditor({
  props,
}: ForeachContainerProps) {
  const childrenIds = props?.childrenIds ?? [];
  const value = props?.value || "";

  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  return (
    <BaseContainer>
      <div className="mb-2 text-muted-foreground text-xs w-full">
        For each <em>_item</em> in <em>{value}</em>
      </div>
      <EditorChildrenIds
        childrenIds={childrenIds}
        onChange={({ block, blockId, childrenIds }) => {
          setDocument({
            [blockId]: block,
            [currentBlockId]: {
              type: "ForeachContainer",
              data: {
                ...document[currentBlockId].data,
                props: { childrenIds: childrenIds, value },
              },
            },
          });
          setSelectedBlockId(blockId);
        }}
      />
    </BaseContainer>
  );
}

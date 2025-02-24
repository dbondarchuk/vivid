import { Container as BaseContainer } from "@usewaypoint/block-container";

import { ForeachContainerProps, ForeachContainerReaderProps } from "./schema";
import { ReaderBlock } from "../../reader/block";
import { evaluate } from "../../helpers/evaluate";
import React from "react";

export default function ForeachContainerReader({
  props,
  args,
  document,
}: ForeachContainerReaderProps) {
  const childrenIds = props?.childrenIds ?? [];
  if (!props?.value) return <BaseContainer />;

  const array: [] = evaluate(props?.value, args);
  if (!Array.isArray(array)) {
    return <BaseContainer>NOT ARRAY</BaseContainer>;
  }

  const newCtx = (item: any) => ({ ...args, _item: item });

  return (
    <>
      {array.map((item, index) => (
        <React.Fragment key={index}>
          {childrenIds.map((childId) => (
            <ReaderBlock
              key={childId}
              id={childId}
              document={document}
              args={newCtx(item)}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

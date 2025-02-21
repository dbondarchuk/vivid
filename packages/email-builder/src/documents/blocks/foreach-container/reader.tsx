import { Container as BaseContainer } from "@usewaypoint/block-container";

import { ForeachContainerProps } from "./schema";
import { ReaderArgsContext, useReaderArgs } from "../../reader/context";
import { ReaderBlock } from "../../reader/block";
import { evaluate } from "../../helpers/evaluate";

export default function ForeachContainerReader({
  props,
}: ForeachContainerProps) {
  const childrenIds = props?.childrenIds ?? [];
  if (!props?.value) return null;

  const args = useReaderArgs();
  const array: [] = evaluate(props?.value, args);
  if (!Array.isArray(array)) {
    return <BaseContainer>NOT ARRAY</BaseContainer>;
  }

  const newCtx = (item: any) => ({ ...args, _item: item });

  return array.map((item, index) => (
    <ReaderArgsContext.Provider value={newCtx(item)} key={index}>
      {childrenIds.map((childId) => (
        <ReaderBlock key={childId} id={childId} />
      ))}
    </ReaderArgsContext.Provider>
  ));
}

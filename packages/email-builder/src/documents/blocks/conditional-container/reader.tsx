import { evaluate } from "../../helpers/evaluate";
import { ReaderBlock } from "../../reader/block";
import { useReaderArgs } from "../../reader/context";
import { ConditionalContainerProps } from "./schema";

export default function ConditionalContainerReader({
  props,
}: ConditionalContainerProps) {
  const thenChildrenIds = props?.then?.childrenIds ?? [];
  const otherwiseChildrenIds = props?.otherwise?.childrenIds ?? [];
  if (!props?.condition) return null;

  const args = useReaderArgs();
  const result = !!evaluate(props?.condition, args);

  return (result ? thenChildrenIds : otherwiseChildrenIds).map((childId) => (
    <ReaderBlock key={childId} id={childId} />
  ));
}

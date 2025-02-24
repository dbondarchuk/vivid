import { evaluate } from "../../helpers/evaluate";
import { ReaderBlock } from "../../reader/block";
import { ConditionalContainerReaderProps } from "./schema";

export default function ConditionalContainerReader({
  props,
  document,
  args,
}: ConditionalContainerReaderProps) {
  const thenChildrenIds = props?.then?.childrenIds ?? [];
  const otherwiseChildrenIds = props?.otherwise?.childrenIds ?? [];
  if (!props?.condition) return <></>;

  const result = !!evaluate(props?.condition, args);

  return (
    <>
      {(result ? thenChildrenIds : otherwiseChildrenIds).map((childId) => (
        <ReaderBlock
          key={childId}
          id={childId}
          document={document}
          args={args}
        />
      ))}
    </>
  );
}

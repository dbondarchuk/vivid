import { ColumnsContainer as BaseColumnsContainer } from "@usewaypoint/block-columns-container";

import { ColumnsContainerReaderProps } from "./schema";
import { ReaderBlock } from "../../reader/block";

export default function ColumnsContainerReader({
  style,
  props,
  document,
  args,
}: ColumnsContainerReaderProps) {
  const { columns, ...restProps } = props ?? {};
  let cols = undefined;
  if (columns) {
    cols = columns.map((col) =>
      col.childrenIds.map((childId) => (
        <ReaderBlock
          key={childId}
          id={childId}
          document={document}
          args={args}
        />
      ))
    );
  }

  return (
    <BaseColumnsContainer props={restProps} columns={cols} style={style} />
  );
}

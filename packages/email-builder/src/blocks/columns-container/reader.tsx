import { ReaderBlock, TReaderBlock } from "@vivid/builder";
import { ColumnsContainerReaderProps } from "./schema";
import { BaseColumnsContainer } from "./base";

export const ColumnsContainerReader = ({
  style,
  props,
  ...rest
}: ColumnsContainerReaderProps) => {
  const { columns, ...restProps } = props ?? {};
  let cols = undefined;
  if (columns) {
    cols = columns.map((col) =>
      col.children.map((child: TReaderBlock) => (
        <ReaderBlock key={child.id} block={child} {...rest} />
      ))
    );
  }

  return (
    <BaseColumnsContainer props={restProps} columns={cols} style={style} />
  );
};

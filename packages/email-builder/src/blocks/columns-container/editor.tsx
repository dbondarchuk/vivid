import { EditorChildren, useCurrentBlock } from "@vivid/builder";
import { BaseColumnsContainer } from "./base";
import { ColumnsContainerProps } from "./schema";

export default function ColumnsContainerEditor({
  style,
  props,
}: ColumnsContainerProps) {
  const currentBlock = useCurrentBlock<ColumnsContainerProps>();

  const { columns, ...restProps } = currentBlock.data?.props ?? {};

  return (
    <BaseColumnsContainer
      props={restProps}
      style={currentBlock.data?.style}
      columns={[
        <EditorChildren
          block={currentBlock}
          property="props.columns.0"
          children={columns?.[0]?.children}
        />,
        <EditorChildren
          block={currentBlock}
          property="props.columns.1"
          children={columns?.[1]?.children}
        />,
        <EditorChildren
          block={currentBlock}
          property="props.columns.2"
          children={columns?.[2]?.children}
        />,
      ]}
    />
  );
}

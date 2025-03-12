import { templateProps } from "../helpers/template-props";
import { BaseZodDictionary } from "../types";
import { BaseReaderBlockProps, TReaderBlock } from "./core";

export type TReaderBlockProps = BaseReaderBlockProps<any> & {
  block: TReaderBlock;
};

export function ReaderBlock({ block, ...rest }: TReaderBlockProps) {
  const Component = rest.blocks[block.type].Reader;
  return (
    <Component
      {...rest}
      {...templateProps(block.data, rest.args)}
      key={block.id}
    />
  );
}

export type TReaderProps<T extends BaseZodDictionary> = BaseReaderBlockProps<T>;

export function Reader<T extends BaseZodDictionary>({
  document,
  args,
  blocks,
}: TReaderProps<T>) {
  return (
    <ReaderBlock
      block={document}
      document={document}
      args={args}
      blocks={blocks}
    />
  );
}

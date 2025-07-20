import { Reader } from "@vivid/builder";
import { ReaderBlocks } from "./blocks/reader";
export * from "./header";

export const PageReader = ({
  document,
  args,
}: {
  document: any;
  args?: any;
}) => {
  return <Reader document={document} blocks={ReaderBlocks} args={args} />;
};

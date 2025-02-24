import { BlockConfiguration } from "@usewaypoint/document-core";
import { z } from "zod";

import {
  BaseReaderBlockProps,
  BaseZodDictionary,
  DocumentBlocksDictionary,
  READER_DICTIONARY,
  TReaderDocument,
} from "./core";

export function buildBlockComponent<T extends BaseZodDictionary>(
  blocks: DocumentBlocksDictionary<T>
) {
  return function BlockComponent({
    type,
    data,
    args,
    document,
  }: BlockConfiguration<T> & BaseReaderBlockProps) {
    const Component = blocks[type].Component;
    return <Component {...data} args={args} document={document} />;
  };
}

export const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);

export type TReaderBlockProps = BaseReaderBlockProps & {
  id: string;
};

export function ReaderBlock({ id, document, args }: TReaderBlockProps) {
  return <BaseReaderBlock {...document[id]} args={args} document={document} />;
}

export type TReaderProps = BaseReaderBlockProps & {
  rootBlockId: string;
};

export function Reader({ document, rootBlockId, args }: TReaderProps) {
  return (
    // <ReaderContext.Provider value={document}>
    <ReaderBlock id={rootBlockId} document={document} args={args} />
    // </ReaderContext.Provider>
  );
}

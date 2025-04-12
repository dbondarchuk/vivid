import { BuilderSchema, ReaderDocumentBlocksDictionary } from "../types";

export type TReaderBlock = { type: string; data: any; id: string };
export type TReaderDocument = TReaderBlock;

export type BaseReaderBlockProps<T extends BuilderSchema> = {
  document: TReaderBlock; // TReaderDocument
  blocks: ReaderDocumentBlocksDictionary<T>;
  args: Record<string, any>;
};

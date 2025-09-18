import {
  BaseBlockProps,
  BuilderSchema,
  ReaderDocumentBlocksDictionary,
} from "../types";

export type TReaderBlock = {
  type: string;
  data: any;
  id: string;
  base?: BaseBlockProps;
};

export type TReaderDocument = TReaderBlock;

export type BaseReaderBlockProps<T extends BuilderSchema> = {
  document: TReaderBlock; // TReaderDocument
  blocks: ReaderDocumentBlocksDictionary<T>;
  args: Record<string, any>;
  block: TReaderBlock;
  isEditor?: boolean;
};

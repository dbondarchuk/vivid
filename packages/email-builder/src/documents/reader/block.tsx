import { buildBlockComponent } from "@usewaypoint/document-core";
import { z } from "zod";

import { READER_DICTIONARY, ReaderBlockSchema } from "./core";
import { ReaderArgsContext, ReaderContext, useReaderDocument } from "./context";

export const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);

export type TReaderBlockProps = { id: string };
export function ReaderBlock({ id }: TReaderBlockProps) {
  const document = useReaderDocument();
  return <BaseReaderBlock {...document[id]} />;
}

export type TReaderProps = {
  document: Record<string, z.infer<typeof ReaderBlockSchema>>;
  rootBlockId: string;
  args?: Record<string, any>;
};
export default function Reader({ document, rootBlockId, args }: TReaderProps) {
  return (
    <ReaderContext.Provider value={document}>
      <ReaderArgsContext.Provider value={args || {}}>
        <ReaderBlock id={rootBlockId} />
      </ReaderArgsContext.Provider>
    </ReaderContext.Provider>
  );
}

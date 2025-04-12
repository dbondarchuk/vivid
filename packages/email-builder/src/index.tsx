"use client";

import { Builder, TEditorConfiguration } from "@vivid/builder";
import { EditorBlocks, RootBlock } from "./blocks";
import { ReaderBlocks } from "./blocks/reader";
import { EditorBlocksSchema } from "./blocks/schema";

type EmailBuilderProps = {
  value?: TEditorConfiguration;
  onChange?: (value: TEditorConfiguration) => void;
  onIsValidChange?: (isValid: boolean) => void;
  args?: Record<string, any>;
};

export const EmailBuilder = ({
  args,
  value,
  onChange,
  onIsValidChange,
}: EmailBuilderProps) => {
  return (
    <Builder
      defaultValue={value}
      onChange={onChange}
      onIsValidChange={onIsValidChange}
      args={args}
      schemas={EditorBlocksSchema}
      editorBlocks={EditorBlocks}
      readerBlocks={ReaderBlocks}
      rootBlock={RootBlock}
    />
  );
};

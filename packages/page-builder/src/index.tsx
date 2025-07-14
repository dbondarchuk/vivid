"use client";

import { Builder, TEditorConfiguration } from "@vivid/builder";
import { StylingConfiguration } from "@vivid/types";
import { EditorBlocks, RootBlock } from "./blocks";
import { ReaderBlocks } from "./blocks/reader";
import { EditorBlocksSchema } from "./blocks/schema";
import { SidebarTab } from "@vivid/builder";
export { Styling } from "./helpers/styling";

type PageBuilderProps = {
  value?: TEditorConfiguration;
  onChange?: (value: TEditorConfiguration) => void;
  onIsValidChange?: (isValid: boolean) => void;
  args?: Record<string, any>;
  extraTabs?: SidebarTab[];
};

export const PageBuilder = ({
  args,
  value,
  onChange,
  onIsValidChange,
  extraTabs,
}: PageBuilderProps) => {
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
      extraTabs={extraTabs}
      sidebarWidth={28}
    />
  );
};

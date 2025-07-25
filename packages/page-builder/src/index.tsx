"use client";

import {
  Builder,
  EditorDocumentBlocksDictionary,
  SidebarTab,
  TEditorConfiguration,
} from "@vivid/builder";
import { useI18n } from "@vivid/i18n";
import { PageHeader } from "@vivid/types";
import { useMemo } from "react";
import { EditorBlocks, RootBlock } from "./blocks";
import { ReaderBlocks } from "./blocks/reader";
import { EditorBlocksSchema } from "./blocks/schema";
import { Header } from "./header";
export { Styling } from "./helpers/styling";

type PageBuilderProps = {
  value?: TEditorConfiguration;
  onChange?: (value: TEditorConfiguration) => void;
  onIsValidChange?: (isValid: boolean) => void;
  args?: Record<string, any>;
  extraTabs?: SidebarTab[];
  header?: {
    config: PageHeader;
    name: string;
    logo?: string;
  };
  footer?: React.ReactNode;
  notAllowedBlocks?: (keyof typeof EditorBlocks)[];
};

export const PageBuilder = ({
  args,
  value,
  onChange,
  onIsValidChange,
  extraTabs,
  header,
  footer,
  notAllowedBlocks,
}: PageBuilderProps) => {
  const tTranslation = useI18n("translation");
  const headerComponent = header ? (
    <Header
      name={header.name}
      logo={header.logo}
      config={header.config}
      t={tTranslation}
      className="-top-8"
    />
  ) : null;

  const editorBlocks = useMemo(() => {
    if (notAllowedBlocks) {
      return Object.fromEntries(
        Object.entries(EditorBlocks).filter(
          ([key]) =>
            !notAllowedBlocks.includes(key as keyof typeof EditorBlocks)
        )
      );
    }
    return EditorBlocks;
  }, [notAllowedBlocks]);

  return (
    <Builder
      defaultValue={value}
      onChange={onChange}
      onIsValidChange={onIsValidChange}
      args={args}
      schemas={EditorBlocksSchema}
      editorBlocks={
        editorBlocks as EditorDocumentBlocksDictionary<
          typeof EditorBlocksSchema
        >
      }
      readerBlocks={ReaderBlocks}
      rootBlock={RootBlock}
      extraTabs={extraTabs}
      sidebarWidth={28}
      header={headerComponent}
      footer={footer}
    />
  );
};

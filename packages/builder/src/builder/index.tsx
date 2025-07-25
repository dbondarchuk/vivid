"use client";

import { cn, SidebarInset, SidebarProvider } from "@vivid/ui";
import {
  EditorArgsContext,
  EditorStateProvider,
  useEditorStateStore,
  useFullScreen,
  useResetDocument,
} from "../documents/editor/context";
import { TEditorBlock, TEditorConfiguration } from "../documents/editor/core";
import {
  BaseZodDictionary,
  EditorDocumentBlocksDictionary,
  ReaderDocumentBlocksDictionary,
} from "../documents/types";
import { InspectorDrawer, SidebarTab } from "./inspector-drawer";
import { TemplatePanel } from "./template-panel";
import { useEffect } from "react";

export type BuilderProps<T extends BaseZodDictionary> = {
  defaultValue?: TEditorConfiguration;
  onChange?: (value: TEditorConfiguration) => void;
  onIsValidChange?: (isValid: boolean) => void;
  args?: Record<string, any>;
  schemas: T;
  editorBlocks: EditorDocumentBlocksDictionary<T>;
  readerBlocks: ReaderDocumentBlocksDictionary<T>;
  rootBlock: TEditorBlock;
  key?: string;
  extraTabs?: SidebarTab[];
  sidebarWidth?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

const BuilderInternal = ({
  defaultValue,
  onChange,
  onIsValidChange,
  readerBlocks,
  args,
  key,
  extraTabs = [],
  sidebarWidth = 18,
  header,
  footer,
}: Omit<BuilderProps<any>, "editorBlocks" | "rootBlock" | "schemas">) => {
  const resetDocument = useResetDocument();
  const errors = useEditorStateStore((s) => s.errors) || {};
  const isValid = Object.keys(errors).length === 0;
  const fullScreen = useFullScreen();

  useEffect(() => {
    onIsValidChange?.(isValid);
  }, [isValid, onIsValidChange]);

  useEffect(() => resetDocument(defaultValue, onChange), [key]);

  return (
    <SidebarProvider
      className={cn(
        "!bg-transparent h-full min-h-full",
        fullScreen && "fixed inset-0 z-20"
      )}
      style={
        {
          "--sidebar-width": `${sidebarWidth}rem`,
        } as React.CSSProperties
      }
    >
      <SidebarInset className="flex flex-col w-full h-full min-h-full" asDiv>
        <TemplatePanel
          args={args}
          readerBlocks={readerBlocks}
          header={header}
          footer={footer}
        />
      </SidebarInset>
      <InspectorDrawer extraTabs={extraTabs} />
    </SidebarProvider>
  );
};

export const Builder = <T extends BaseZodDictionary>({
  args,
  defaultValue,
  editorBlocks,
  rootBlock,
  schemas,
  ...rest
}: BuilderProps<T>) => {
  return (
    <EditorStateProvider
      blocks={editorBlocks}
      rootBlock={rootBlock}
      document={defaultValue}
      schemas={schemas}
    >
      <EditorArgsContext.Provider value={args || {}}>
        <BuilderInternal args={args} defaultValue={defaultValue} {...rest} />
      </EditorArgsContext.Provider>
    </EditorStateProvider>
  );
};

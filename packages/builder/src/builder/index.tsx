"use client";

import { SidebarInset, SidebarProvider } from "@vivid/ui";
import {
  EditorArgsContext,
  EditorStateProvider,
  useEditorStateStore,
  useResetDocument,
} from "../documents/editor/context";
import { TEditorBlock, TEditorConfiguration } from "../documents/editor/core";
import {
  BaseZodDictionary,
  EditorDocumentBlocksDictionary,
  ReaderDocumentBlocksDictionary,
} from "../documents/types";
import { InspectorDrawer } from "./inspector-drawer";
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
};

const BuilderInternal = ({
  defaultValue,
  onChange,
  onIsValidChange,
  readerBlocks,
  args,
  key,
}: Omit<BuilderProps<any>, "editorBlocks" | "rootBlock" | "schemas">) => {
  const resetDocument = useResetDocument();
  const errors = useEditorStateStore((s) => s.errors) || {};
  const isValid = Object.keys(errors).length === 0;

  useEffect(() => {
    onIsValidChange?.(isValid);
  }, [isValid, onIsValidChange]);

  useEffect(() => resetDocument(defaultValue, onChange), [key]);

  return (
    <SidebarProvider className="!bg-transparent h-full min-h-full">
      <SidebarInset className="flex flex-col w-full h-full min-h-full" asDiv>
        <TemplatePanel args={args} readerBlocks={readerBlocks} />
      </SidebarInset>
      <InspectorDrawer />
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

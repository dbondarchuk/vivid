"use client";

import { SidebarInset, SidebarProvider, useDebounce } from "@vivid/ui";
import React from "react";
import {
  defaultDocument,
  EditorArgsContext,
  setDocument,
  useDocument,
} from "../documents/editor/context";
import { TEditorConfiguration } from "../documents/editor/core";
import InspectorDrawer from "./inspector-drawer";
import TemplatePanel from "./template-panel";

type EmailBuilderProps = {
  value?: TEditorConfiguration;
  onChange?: (value: TEditorConfiguration) => void;
  args?: Record<string, any>;
};

export const EmailBuilder = ({ args, value, onChange }: EmailBuilderProps) => {
  const document = useDebounce(useDocument());
  React.useEffect(() => {
    setDocument(value || defaultDocument);
  }, [value]);

  React.useEffect(() => {
    if (JSON.stringify(document) !== JSON.stringify(value)) {
      onChange?.(document);
    }
  }, [document, onChange]);

  return (
    <EditorArgsContext.Provider value={args || {}}>
      <SidebarProvider className="!bg-transparent h-full min-h-full">
        <SidebarInset className="flex flex-col w-full h-full min-h-full" asDiv>
          <TemplatePanel args={args} />
        </SidebarInset>
        <InspectorDrawer />
      </SidebarProvider>
    </EditorArgsContext.Provider>
  );
};

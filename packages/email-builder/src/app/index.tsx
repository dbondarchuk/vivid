"use client";

import { SidebarInset, SidebarProvider, useDebounce } from "@vivid/ui";
import InspectorDrawer from "./inspector-drawer";
import TemplatePanel from "./template-panel";
import {
  defaultDocument,
  setDocument,
  useDocument,
} from "../documents/editor/context";
import React from "react";
import { TEditorConfiguration } from "../documents/editor/core";

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
    <>
      <SidebarProvider className="!bg-transparent">
        <SidebarInset className="flex flex-col w-full" asDiv>
          <TemplatePanel args={args} />
        </SidebarInset>
        <InspectorDrawer />
      </SidebarProvider>
    </>
  );
};

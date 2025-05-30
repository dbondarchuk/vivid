"use client";

import { createPlatePlugin } from "@udecode/plate/react";

import { FloatingToolbar } from "../../plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../../plate-ui/floating-toolbar-buttons";

export const FloatingToolbarPlugin = (isMarkdown?: boolean) =>
  createPlatePlugin({
    key: "floating-toolbar",
    render: {
      afterEditable: () => (
        <FloatingToolbar>
          <FloatingToolbarButtons isMarkdown={isMarkdown} />
        </FloatingToolbar>
      ),
    },
  });

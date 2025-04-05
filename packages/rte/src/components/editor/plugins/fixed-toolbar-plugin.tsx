"use client";

import { createPlatePlugin } from "@udecode/plate/react";

import { FixedToolbar } from "../../plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "../../plate-ui/fixed-toolbar-buttons";

export const FixedToolbarPlugin = (isMarkdown?: boolean) =>
  createPlatePlugin({
    key: "fixed-toolbar",
    render: {
      beforeEditable: () => (
        <FixedToolbar>
          <FixedToolbarButtons isMarkdown={isMarkdown} />
        </FixedToolbar>
      ),
    },
  });

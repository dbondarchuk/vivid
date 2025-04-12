"use client";

import { withRef } from "@udecode/cn";
import {
  useToggleToolbarButton,
  useToggleToolbarButtonState,
} from "@udecode/plate-toggle/react";
import { ToolbarButton } from "@vivid/ui";
import { ListCollapseIcon } from "lucide-react";

export const ToggleToolbarButton = withRef<typeof ToolbarButton>(
  (rest, ref) => {
    const state = useToggleToolbarButtonState();
    const { props } = useToggleToolbarButton(state);

    return (
      <ToolbarButton ref={ref} tooltip="Toggle" {...props} {...rest}>
        <ListCollapseIcon />
      </ToolbarButton>
    );
  }
);

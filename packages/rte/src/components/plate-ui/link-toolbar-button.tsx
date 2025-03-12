"use client";

import { withRef } from "@udecode/cn";
import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from "@udecode/plate-link/react";
import { ToolbarButton } from "@vivid/ui";
import { Link } from "lucide-react";

export const LinkToolbarButton = withRef<typeof ToolbarButton>((rest, ref) => {
  const state = useLinkToolbarButtonState();
  const { props } = useLinkToolbarButton(state);

  return (
    <ToolbarButton
      ref={ref}
      data-plate-focus
      tooltip="Link"
      {...props}
      {...rest}
    >
      <Link />
    </ToolbarButton>
  );
});

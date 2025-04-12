"use client";

import { useCommentAddButton } from "@udecode/plate-comments/react";
import { ToolbarButton } from "@vivid/ui";
import { MessageSquarePlus } from "lucide-react";

export function CommentToolbarButton() {
  const { hidden, props } = useCommentAddButton();

  if (hidden) return null;

  return (
    <ToolbarButton tooltip="Comment (⌘+⇧+M)" {...props}>
      <MessageSquarePlus />
    </ToolbarButton>
  );
}

import type { SlateLeafProps } from "@udecode/plate";
import type { TCommentText } from "@udecode/plate-comments";

import { SlateLeaf } from "@udecode/plate";
import { cn } from "@vivid/ui";

export function CommentLeafStatic({
  children,
  className,
  ...props
}: SlateLeafProps<TCommentText>) {
  return (
    <SlateLeaf
      className={cn(
        className,
        "border-b-2 border-b-highlight/35 bg-highlight/15",
      )}
      {...props}
    >
      <>{children}</>
    </SlateLeaf>
  );
}

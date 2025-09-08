import type { SlateLeafProps } from "@udecode/plate";

import { SlateLeaf } from "@udecode/plate";
import { cn } from "@vivid/ui";

export const CodeLeafStatic = ({
  children,
  className,
  ...props
}: SlateLeafProps) => {
  return (
    <SlateLeaf
      as="code"
      className={cn(
        className,
        "rounded-md bg-muted px-[0.3em] py-[0.2em] font-mono text-sm whitespace-pre-wrap",
      )}
      {...props}
    >
      {children}
    </SlateLeaf>
  );
};

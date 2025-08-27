import type { SlateElementProps } from "@udecode/plate";

import { SlateElement } from "@udecode/plate";
import { cn } from "@vivid/ui";

export const BlockquoteElementStatic = ({
  children,
  className,
  ...props
}: SlateElementProps) => {
  return (
    <SlateElement
      as="blockquote"
      className={cn(className, "my-1 border-l-2 pl-6 italic")}
      {...props}
    >
      {children}
    </SlateElement>
  );
};

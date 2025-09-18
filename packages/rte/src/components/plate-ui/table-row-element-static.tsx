import type { SlateElementProps } from "@udecode/plate";

import { SlateElement } from "@udecode/plate";
import { cn } from "@vivid/ui";

export function TableRowElementStatic({
  children,
  className,
  ...props
}: SlateElementProps) {
  return (
    <SlateElement as="tr" className={cn(className, "h-full")} {...props}>
      {children}
    </SlateElement>
  );
}

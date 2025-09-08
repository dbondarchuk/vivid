"use client";

import { withRef } from "@udecode/plate/react";
import { cn } from "@vivid/ui";

import { PlateElement } from "./plate-element";

export const ParagraphElement = withRef<typeof PlateElement>(
  ({ children, className, ...props }, ref) => {
    return (
      <PlateElement
        ref={ref}
        className={cn(className, "m-0 px-0 py-1")}
        {...props}
      >
        {children}
      </PlateElement>
    );
  },
);

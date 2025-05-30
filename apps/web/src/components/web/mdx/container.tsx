import { cn } from "@vivid/ui";
import React from "react";

export const Container: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div {...props} className={cn("container mx-auto", className)}>
      {children}
    </div>
  );
};

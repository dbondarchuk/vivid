import { cn } from "@/lib/utils";
import React from "react";

export type GridProps = React.HTMLAttributes<HTMLDivElement> & {
  gap?: number | string;
  dir?: "row" | "col" | "row-reverse" | "col-reverse";
  children: React.ReactNode | React.ReactNode[];
};

const dirs = {
  row: "flex-row",
  col: "flex-col",
  "row-reverse": "flex-row-reverse",
  "col-reverse": "flex-col-reverse",
};

export const Grid: React.FC<GridProps> = ({
  className,
  gap = 10,
  dir = "row",
  children,
  ...props
}) => {
  return (
    <div className={cn("flex", dir ? dirs[dir] : null, `gap-${gap}`, className)} {...props}>
      {children}
    </div>
  );
};

import { cn } from "@/lib/utils";
import React from "react";
import { Section } from "../section";
import { GridSection as GridProps } from "./Grid.types";

export const GridSection: React.FC<GridProps> = ({
  title,
  rows,
  className,
  id,
  gap = 20,
}) => {
  return (
    <section
      className={cn(`flex flex-col gap-${gap} w-full scroll-m-20`, className)}
      id={id}
    >
      {title && <h3 className="w-full text-4xl text-center appear">{title}</h3>}
      {rows.map((row, i) => (
        <div key={i} id={id ? `${id}-row-${i}` : undefined}>
          {row.title && (
            <h4 className="text-3xl text-center appear">{row.title}</h4>
          )}
          <div className={cn(`flex gap-${row.gap ?? 10}`, row.className)}>
            {row.columns.map((column, j) => (
              <div key={j} className={cn(`basis-${row.basis || 1}`, row.gap)}>
                <Section {...column} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

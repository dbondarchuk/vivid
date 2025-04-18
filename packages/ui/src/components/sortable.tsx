"use client";

import { SortableContext } from "@dnd-kit/sortable";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader } from "./card";
import { ScrollArea } from "./scroll-area";
import {
  DndContext,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import React from "react";
import { Button } from "./button";
import { ChevronsUpDown, Plus } from "lucide-react";

export type SortableProps = {
  title: string;
  ids: string[];
  onSort: (activeId: string, overId: string) => void;
  onAdd: () => void;
  children: React.ReactNode | React.ReactNode[];
  disabled?: boolean;
  allCollapsed?: boolean;
  collapse?: () => void;
  className?: string;
};

export function Sortable({
  children,
  title,
  ids,
  disabled,
  allCollapsed,
  collapse,
  onSort,
  onAdd,
  className,
}: SortableProps) {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const variants = cva(
    "h-fit max-h-[75vh] max-w-full bg-secondary flex flex-col flex-shrink-0 snap-center w-full",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    onSort(activeId.toString(), overId.toString());
  }

  return (
    <Card className={variants({ className })}>
      <CardHeader className="justify-between flex flex-row items-center border-b-2 p-4 text-left font-semibold space-y-0">
        <div className="hidden md:block">&nbsp;</div>
        {title}
        <div className="flex flex-row gap-2 items-center">
          {collapse && (
            <Button
              type="button"
              disabled={disabled}
              variant="outline"
              onClick={collapse}
              aria-label={allCollapsed ? "Expand all" : "Collapse all"}
            >
              <ChevronsUpDown size={20} />
            </Button>
          )}
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            onClick={onAdd}
            aria-label="Add a new item"
          >
            <Plus size={20} />
          </Button>
        </div>
      </CardHeader>
      <DndContext sensors={sensors} onDragOver={onDragOver}>
        <CardContent className="overflow-x-hidden p-2">
          <ScrollArea className="h-full">
            <SortableContext items={ids}>{children}</SortableContext>
          </ScrollArea>
        </CardContent>
      </DndContext>
    </Card>
  );
}

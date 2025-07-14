import { useSortable } from "@dnd-kit/sortable";
import { Button, cn, PopoverTrigger } from "@vivid/ui";
import { Plus } from "lucide-react";
import React from "react";
import { useActiveDragBlock } from "../../../../editor/context";

export const PlaceholderButton: React.FC<{
  contextId: string;
  isOver?: boolean;
  className?: string;
}> = ({ contextId, isOver, className }) => {
  const id = React.useId();
  const draggingBlock = useActiveDragBlock();

  const { setNodeRef, isOver: isOverSortable } = useSortable({
    id,
    data: { contextId },
  });
  return (
    <div
      className={cn(
        "flex content-center justify-center items-center w-full",
        !!draggingBlock &&
          "border-2 border-dashed border-blue-400 min-h-20 min-w-36 max-w-full",
        (isOver || isOverSortable) && " bg-blue-800 bg-opacity-50",
        className
      )}
      ref={setNodeRef}
    >
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="text-secondary-foreground"
        >
          <Plus size={16} />
        </Button>
      </PopoverTrigger>
    </div>
  );
};

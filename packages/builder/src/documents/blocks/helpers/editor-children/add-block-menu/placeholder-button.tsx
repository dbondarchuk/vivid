import { useSortable } from "@dnd-kit/sortable";
import { Button, cn, PopoverTrigger } from "@vivid/ui";
import { Plus } from "lucide-react";
import React from "react";
import { useHasActiveDragBlock } from "../../../../editor/context";

export const PlaceholderButton: React.FC<{
  contextId: string;
  isOver?: boolean;
  className?: string;
  disabledDroppable?: boolean;
  size?: "small" | "default";
}> = ({
  contextId,
  isOver: isOverProp,
  className,
  disabledDroppable,
  size = "default",
}) => {
  const id = React.useId();
  const hasActiveDragBlock = useHasActiveDragBlock();

  const { setNodeRef, isOver: isOverSortable } = useSortable({
    id,
    data: { contextId },
    disabled: {
      droppable: disabledDroppable,
      draggable: true,
    },
  });

  const isOver = isOverProp || (isOverSortable && !disabledDroppable);

  return (
    <div
      className={cn(
        "flex content-center justify-center items-center w-full",
        !!hasActiveDragBlock &&
          "border-2 border-dashed border-blue-400 min-h-20 min-w-36 max-w-full",
        isOver && " bg-blue-800 bg-opacity-50",
        className,
      )}
      ref={setNodeRef}
    >
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "text-secondary-foreground",
            size === "small" && "w-4 h-4",
          )}
        >
          <Plus size={16} />
        </Button>
      </PopoverTrigger>
    </div>
  );
};

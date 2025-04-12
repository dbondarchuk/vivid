import { useSortable } from "@dnd-kit/sortable";
import { Button, cn, PopoverTrigger } from "@vivid/ui";
import { Plus } from "lucide-react";
import React from "react";

export const PlaceholderButton: React.FC<{
  contextId: string;
}> = ({ contextId }) => {
  const id = React.useId();
  const { setNodeRef } = useSortable({ id, data: { contextId } });
  return (
    <div
      className={cn("flex content-center justify-center w-full")}
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

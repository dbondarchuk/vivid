import type { UniqueIdentifier } from "@dnd-kit/abstract";
import { useDragDropManager } from "@dnd-kit/react";
import { useComputed, useOnElementChange } from "@dnd-kit/react/hooks";
import type { RefOrValue } from "@dnd-kit/react/utilities";
import { useMemo, useRef } from "react";

export interface UseDragHandleInput {
  id: UniqueIdentifier;
  element?: RefOrValue<Element>;
}

/**
 * A hook that allows you to set the drag handle for a draggable element.
 *
 * @param id - The unique identifier of the draggable element.
 * @param element - The ref or value of the drag handle element if you already have a reference to it.
 * @returns A ref that you can attach to the drag handle element
 */
export function useDragHandle({ id, element }: UseDragHandleInput) {
  const manager = useDragDropManager();
  const handleRef = useRef<Element | null>(null);
  const draggableInstance = useComputed(
    () => manager?.registry.draggables.get(id),
    [id],
  ).value;

  const value = handleRef.current ?? element;

  useOnElementChange(value, (handle) => {
    if (!draggableInstance) return;

    draggableInstance.handle = handle;
  });

  const isDragging = !!manager?.dragOperation?.status?.dragging;

  const result = useMemo(
    () => ({ handleRef, isDragging }),
    [handleRef, isDragging],
  );
  return result;
}

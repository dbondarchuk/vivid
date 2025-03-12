import { Fragment } from "react";

import { EditorBlock } from "../../../editor/block";
import { TEditorBlock } from "../../../editor/core";

import { SortableContext, rectSwappingStrategy } from "@dnd-kit/sortable";
import { DragOverlay } from "@dnd-kit/core";
import { cn } from "@vivid/ui";
import {
  useActiveDragBlock,
  useActiveOverBlock,
  useDocument,
  useSetSelectedBlockId,
} from "../../../editor/context";
import { AddBlockButton } from "./add-block-menu";
import { createPortal } from "react-dom";

export type EditorChildrenChange = {
  blockId: string;
  block: TEditorBlock;
  children: TEditorBlock[];
};

export type EditorChildrenProps = {
  block: TEditorBlock;
  children?: TEditorBlock[];
  property: string;
  onChange: (val: EditorChildrenChange) => void;
};

// const Placeholder = ({ contextId }: { contextId: string }) => {
//   const id = useId();
//   const { setNodeRef } = useSortable({ id, data: { contextId } });
//   return (
//     <div
//       className="w-full outline-dashed p-8 outline-lime-300 text-gray-400 text-center"
//       id={id}
//       ref={setNodeRef}
//     >
//       Drop here
//     </div>
//   );
// };

export const EditorChildren: React.FC<EditorChildrenProps> = ({
  children,
  onChange,
  property,
  block,
}) => {
  const document = useDocument();
  const setSelectedBlockId = useSetSelectedBlockId();

  const appendBlock = (block: TEditorBlock) => {
    setTimeout(() => setSelectedBlockId(block.id), 200);

    return onChange({
      blockId: block.id,
      block,
      children: [...(children || []), block],
    });
  };

  const insertBlock = (block: TEditorBlock, index: number) => {
    const newChildren = [...(children || [])];
    newChildren.splice(index, 0, block);

    setTimeout(() => setSelectedBlockId(block.id), 200);

    return onChange({
      blockId: block.id,
      block,
      children: newChildren,
    });
  };

  // const { isOver, setNodeRef } = useDroppable({ id: block.id, data: block });
  const activeOverBlock = useActiveOverBlock();
  const activeDragBlock = useActiveDragBlock();
  const isOver =
    activeOverBlock?.blockId === block.id &&
    activeOverBlock?.property === property;

  const ids =
    children?.filter((block) => !!block).map((block) => block.id) || [];

  const isChildActiveDragBlock =
    activeDragBlock && activeDragBlock.parentBlockId === block.id;

  const contextId = `${block.id}/${property}`;

  return (
    <div
      // ref={setNodeRef}
      className={cn("w-full relative")}
    >
      <SortableContext
        items={ids}
        id={contextId}
        strategy={rectSwappingStrategy}
      >
        {!children || children.length === 0 ? (
          <AddBlockButton
            placeholder
            onSelect={appendBlock}
            contextId={contextId}
          />
        ) : (
          <>
            {children
              .filter((block) => !!block)
              .map((child, i) => (
                <Fragment key={child.id}>
                  <AddBlockButton onSelect={(block) => insertBlock(block, i)} />
                  <EditorBlock block={child} />
                </Fragment>
              ))}
            {window &&
              "document" in window &&
              createPortal(
                <DragOverlay
                  dropAnimation={{
                    duration: 500,
                    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                  }}
                >
                  {isChildActiveDragBlock ? (
                    <EditorBlock block={activeDragBlock.block} isOverlay />
                  ) : null}
                  {/* </DragOverlay> */}
                </DragOverlay>,
                window.document.body
              )}
            <AddBlockButton onSelect={appendBlock} />
          </>
        )}
      </SortableContext>
      {isOver && block.id !== document.id && (
        <div className="absolute z-1 top-0 left-0 bottom-0 right-0 bg-blue-400/40" />
      )}
    </div>
  );
};

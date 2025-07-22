"use client";

import { Fragment, useMemo } from "react";

import { EditorBlock } from "../../../editor/block";
import { TEditorBlock } from "../../../editor/core";

import {
  SortableContext,
  rectSwappingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import { cn } from "@vivid/ui";
import {
  useActiveDragBlock,
  useActiveOverBlock,
  useBlocks,
  useDispatchAction,
  useDocument,
  useSetSelectedBlockId,
} from "../../../editor/context";
import { AddBlockButton } from "./add-block-menu";
import { createPortal } from "react-dom";
import { BaseZodDictionary } from "../../../types";
import { Plus } from "lucide-react";
import { usePortalContext } from "../block-wrappers/portal-context";

export type EditorChildrenChange = {
  blockId: string;
  block: TEditorBlock;
  children: TEditorBlock[];
};

export type EditorChildrenProps<T extends BaseZodDictionary = any> = {
  block: TEditorBlock;
  children?: TEditorBlock[];
  property: string;
  hidePrefixAddBlockButton?: boolean;
  maxChildren?: number;
  allowOnly?: keyof T | (keyof T)[];
  // onChange: (val: EditorChildrenChange) => void;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  disabledDroppable?: boolean;
  addButtonSize?: "small" | "default";
  childWrapper?: (props: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLDivElement>;
    id?: string;
  }) => React.ReactNode;
  childrenWrapper?: (props: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    ref?: React.Ref<HTMLDivElement>;
    id?: string;
  }) => React.ReactNode;
  additionalProps?: Record<string, any>;
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

export const EditorChildren = <T extends BaseZodDictionary = any>({
  children,
  property,
  block: currentBlock,
  hidePrefixAddBlockButton,
  maxChildren,
  allowOnly: propAllowOnly,
  id,
  className,
  style,
  disabledDroppable: propDisabledDroppable,
  childWrapper,
  childrenWrapper,
  additionalProps,
  addButtonSize,
}: EditorChildrenProps<T>) => {
  const document = useDocument();
  const setSelectedBlockId = useSetSelectedBlockId();
  const draggingBlock = useActiveDragBlock();
  const blocks = useBlocks();
  const { body } = usePortalContext();
  const dispatchAction = useDispatchAction();

  const allowOnly = useMemo(
    () =>
      propAllowOnly
        ? Array.isArray(propAllowOnly)
          ? propAllowOnly
          : [propAllowOnly]
        : undefined,
    [propAllowOnly]
  );

  const appendBlock = (block: TEditorBlock) => {
    setTimeout(() => setSelectedBlockId(block.id), 200);

    return dispatchAction({
      type: "add-block",
      value: {
        block,
        parentBlockId: currentBlock.id,
        parentBlockProperty: property,
        index: "last",
      },
    });
  };

  const insertBlock = (block: TEditorBlock, index: number) => {
    const newChildren = [...(children || [])];
    newChildren.splice(index, 0, block);

    setTimeout(() => setSelectedBlockId(block.id), 200);

    return dispatchAction({
      type: "add-block",
      value: {
        block,
        parentBlockId: currentBlock.id,
        parentBlockProperty: property,
        index,
      },
    });
  };

  const contextId = `${currentBlock.id}/${property}`;

  const activeOverBlock = useActiveOverBlock();
  const activeDragBlock = useActiveDragBlock();

  const activeDragBlockType = activeDragBlock?.block.type;
  const isChildActiveDragBlock =
    activeDragBlock && activeDragBlock.parentBlockId === currentBlock.id;

  const activeDragBlockAllowedIn =
    !!activeDragBlockType && blocks[activeDragBlockType]?.allowedIn;

  const disabledDroppable =
    propDisabledDroppable ||
    (!isChildActiveDragBlock &&
      ((allowOnly &&
        activeDragBlockType &&
        !allowOnly.includes(activeDragBlockType)) ||
        (!!children?.length &&
          !!maxChildren &&
          children.length >= maxChildren))) ||
    (activeDragBlockAllowedIn &&
      !activeDragBlockAllowedIn.includes(currentBlock.type));

  const { isOver: isOverDroppable, setNodeRef } = useDroppable({
    id: contextId,
    data: currentBlock,
    disabled: disabledDroppable,
  });

  const isOver = isOverDroppable && !disabledDroppable;

  const ids =
    children?.filter((block) => !!block).map((block) => block.id) || [];

  const Wrapper = childrenWrapper ?? "div";
  const ChildWrapper = childWrapper ?? Fragment;

  return (
    <Wrapper
      ref={setNodeRef}
      className={cn("relative", className)}
      id={id}
      style={style}
    >
      {/* <> */}
      <SortableContext
        items={ids}
        id={contextId}
        strategy={verticalListSortingStrategy}
        disabled={{
          droppable: disabledDroppable,
        }}
      >
        {!children ||
        children.length ===
          0 ? //       "w-full h-full min-h-20 flex items-center justify-center relative", //     className={cn( //   <div // activeDragBlockType ? ( // ) : null // ) : ( //   </div> //     /> //       allowOnly={allowOnly} //       contextId={contextId} //       onSelect={appendBlock} //       placeholder //     <AddBlockButton //   > //     )} //         " border-2 border-dashed border-blue-400 bg-blue-400/10" //       isOverDroppable && //       "w-full h-full min-h-40 flex items-center justify-center relative", //     className={cn( //   <div // !disabledDroppable ? ( // // activeDragBlockType ? (
        //       isOverDroppable &&
        //         " border-2 border-dashed border-blue-400 bg-blue-800 bg-opacity-50"
        //     )}
        //   >
        //     <AddBlockButton
        //       placeholder
        //       onSelect={appendBlock}
        //       contextId={contextId}
        //       allowOnly={allowOnly}
        //     />
        //   </div>
        // ) : (
        // <ChildWrapper>
        //   <AddBlockButton
        //     placeholder
        //     onSelect={appendBlock}
        //     contextId={contextId}
        //     allowOnly={allowOnly}
        //     isOver={isOverDroppable}
        //   />
        // </ChildWrapper>
        null : (
          // )
          // )
          <>
            {children
              .filter((block) => !!block)
              .map((child, i) => (
                <Fragment key={child.id}>
                  {!hidePrefixAddBlockButton &&
                    (!maxChildren || children.length < maxChildren) &&
                    !draggingBlock && (
                      <AddBlockButton
                        onSelect={(block) => insertBlock(block, i)}
                        allowOnly={allowOnly}
                        currentBlock={currentBlock.type}
                        size={addButtonSize}
                      />
                    )}
                  <ChildWrapper>
                    <EditorBlock
                      block={child}
                      additionalProps={additionalProps}
                    />
                  </ChildWrapper>
                </Fragment>
              ))}
            {globalThis.window &&
              "document" in globalThis.window &&
              createPortal(
                <DragOverlay
                  dropAnimation={{
                    duration: 500,
                    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                  }}
                  transition="transform 250ms ease"
                >
                  {isChildActiveDragBlock ? (
                    childWrapper ? (
                      childWrapper({
                        children: (
                          <EditorBlock
                            block={activeDragBlock.block}
                            isOverlay
                            additionalProps={additionalProps}
                          />
                        ),
                      })
                    ) : (
                      <EditorBlock block={activeDragBlock.block} isOverlay />
                    )
                  ) : null}
                  {/* </DragOverlay> */}
                </DragOverlay>,
                body
              )}
            {/* {(!maxChildren || children.length < maxChildren) &&
              !draggingBlock && (
                <AddBlockButton onSelect={appendBlock} allowOnly={allowOnly} />
              )} */}
          </>
        )}
      </SortableContext>
      {(!maxChildren || !children || children.length < maxChildren) && (
        <ChildWrapper>
          <AddBlockButton
            placeholder
            onSelect={appendBlock}
            contextId={contextId}
            allowOnly={allowOnly}
            isOver={isOver}
            className="w-auto"
            currentBlock={currentBlock.type}
            disabledDroppable={disabledDroppable}
            size={addButtonSize}
          />
        </ChildWrapper>
      )}
      {isOver && currentBlock.id !== document.id && (
        // <div className="w-full h-full min-h-20 border-2 border-dashed border-blue-800 bg-blue-800/10 flex items-center justify-center relative">
        //   <AddBlockButton
        //     placeholder
        //     onSelect={appendBlock}
        //     contextId={contextId}
        //     allowOnly={allowOnly}
        //   />
        // </div>
        <div className="absolute z-1 top-0 left-0 bottom-0 right-0 bg-blue-800 bg-opacity-50" />
      )}
    </Wrapper>
    // </>
  );
};

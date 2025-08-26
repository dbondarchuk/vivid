"use client";

import React, { memo, useCallback, useEffect } from "react";

import { cva } from "class-variance-authority";

import {
  useCurrentBlockAllowedTypes,
  useCurrentBlockId,
  useCurrentBlockRef,
  useIsCurrentBlockOverlay,
  useCurrentBlockDisableOptions,
} from "../../../editor/block";
import {
  useBlockDepth,
  useBlocks,
  useBlockType,
  useIsActiveHierarchyOverDroppable,
  useIsSelectedBlock,
  useSetSelectedBlockId,
} from "../../../editor/context";

import { closestCenter, directionBiased } from "@dnd-kit/collision";
import { useSortable } from "@dnd-kit/react/sortable";
import { cn } from "@vivid/ui";
import { DndContext } from "../../../../types/dndContext";
import { BlockHandlerPortal } from "./block-handler-portal";
import { BlockNavPortal } from "./block-nav-portal";
import { createDynamicCollisionDetector } from "../../../../builder/dnd/collision/dynamic";

type TEditorBlockWrapperProps = {
  children: React.JSX.Element;
  index: number;
  parentBlockId: string;
  parentProperty: string;
};

const variants = cva("relative max-w-full outline-offset-1 peer-block", {
  variants: {
    dragging: {
      over: "ring-2 opacity-30",
      overlay: "ring-2 ring-primary !opacity-30",
      false: "!opacity-100",
    },
    // over: {
    //   true: "bg-blue-800/40 bg-opacity-50",
    // },
    over: {
      true: "outline outline-blue-100",
    },
    sorting: {
      true: "outline-1 outline-dashed outline-blue-400",
    },
    outline: {
      selected:
        "outline outline-blue-600 [&_+.peer-button>button]:opacity-100 z-[2]",
      hover:
        "outline outline-blue-200 [&_+.peer-button>button]:opacity-100 z-[1]",
    },
  },
});

const NoDragEditorBlockWrapper: React.FC<TEditorBlockWrapperProps> = memo(
  ({ children, index, parentBlockId, parentProperty }) => {
    const ref = useCurrentBlockRef();
    const blockId = useCurrentBlockId();
    const isSelected = useIsSelectedBlock(blockId);
    const isOverlay = useIsCurrentBlockOverlay();
    const disable = useCurrentBlockDisableOptions();
    const blockType = useBlockType(blockId);
    const depth = useBlockDepth(blockId) ?? 0;

    const isActiveHierarchyOverDroppable =
      useIsActiveHierarchyOverDroppable(blockId);
    // const hasActiveDragBlock = useHasActiveDragBlock();

    const [blockElement, setBlockElement] = React.useState<HTMLElement | null>(
      null
    );

    const className = cn(
      "hover:outline hover:outline-blue-200 hover:[&_+.peer-button>button]:opacity-100 hover:z-[1]",
      variants({
        outline: isSelected ? "selected" : undefined,
        over: isActiveHierarchyOverDroppable,
      })
    );

    // Auto-scroll to block when it becomes selected
    useEffect(() => {
      if (isSelected && !isOverlay) {
        const element = ref?.current ?? blockElement;
        if (element) {
          // Use a small delay to ensure the selection state is fully applied
          const timeoutId = setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }, 100);

          return () => clearTimeout(timeoutId);
        }
      }
    }, [isSelected, ref, blockElement, isOverlay]);

    const Element = ref?.current ? (
      <>{children}</>
    ) : (
      <div
        ref={(el) => {
          setBlockElement(el);
        }}
        data-block-id={blockId}
        data-block-type={blockType}
        data-block-index={index}
        data-block-parent-id={parentBlockId}
        data-block-parent-property={parentProperty}
        data-block-depth={depth}
        data-block-is-overlay={isOverlay}
        className={className}
      >
        {children}
      </div>
    );

    return (
      <>
        {Element}

        {!isOverlay && isSelected && (
          <BlockNavPortal
            blockId={blockId}
            blockElement={ref?.current ?? blockElement}
            disable={disable}
          />
        )}
      </>
    );
  }
);

export const DragEditorBlockWrapper: React.FC<TEditorBlockWrapperProps> = memo(
  ({ children, index, parentBlockId, parentProperty }) => {
    const [blockElement, setBlockElement] = React.useState<HTMLElement | null>(
      null
    );
    const ref = useCurrentBlockRef();
    const blockId = useCurrentBlockId();
    const isSelected = useIsSelectedBlock(blockId);
    // const document = useDocument();
    const depth = useBlockDepth(blockId) ?? 0;
    const isOverlay = useIsCurrentBlockOverlay();
    const disable = useCurrentBlockDisableOptions();
    const blockType = useBlockType(blockId);
    const allowOnly = useCurrentBlockAllowedTypes();

    const isActiveHierarchyOverDroppable =
      useIsActiveHierarchyOverDroppable(blockId);

    const parentBlockType = useBlockType(parentBlockId);
    const blocks = useBlocks();

    const setSelectedBlockId = useSetSelectedBlockId();

    const onClick = useCallback(
      (ev: React.MouseEvent<HTMLElement>) => {
        setSelectedBlockId(blockId);
        ev.stopPropagation();
        ev.preventDefault();
      },
      [blockId, setSelectedBlockId]
    );

    // Auto-scroll to block when it becomes selected
    useEffect(() => {
      if (isSelected && !isOverlay) {
        const element = ref?.current ?? blockElement;
        if (element) {
          // Use a small delay to ensure the selection state is fully applied
          const timeoutId = setTimeout(() => {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }, 100);

          return () => clearTimeout(timeoutId);
        }
      }
    }, [isSelected, ref, blockElement]);

    const {
      ref: sortableRef,
      handleRef,
      isDragging,
    } = useSortable({
      id: blockId,
      index,
      group: `${parentBlockId}/${parentProperty}`,
      collisionPriority: depth,
      feedback: "clone",
      element: !disable?.drag ? ref : undefined,
      accept: (draggable) => {
        if (!draggable.type) return false;
        const type = draggable.type as string;
        if (!allowOnly?.includes(type)) return false;

        const allowedParents = blocks[type]?.allowedIn;
        if (
          allowedParents &&
          parentBlockType &&
          !allowedParents.includes(parentBlockType)
        )
          return false;

        return true;
      },
      type: blockType ?? "",
      disabled: disable?.drag || isOverlay,
      transition: {
        duration: 200,
        easing: "cubic-bezier(0.2, 0, 0, 1)",
      },
      // collisionDetector: closestCenter,
      collisionDetector: directionBiased,
      // collisionDetector: createDynamicCollisionDetector("dynamic"),
      data: {
        context: {
          parentBlockId,
          parentProperty,
          index,
          type: blockType ?? "",
        } satisfies DndContext,
        size: {
          width: blockElement?.clientWidth,
          height: blockElement?.clientHeight,
        },
      },
    });

    const className = cn(
      "hover:outline hover:outline-blue-200 hover:[&_+.peer-button>button]:opacity-100 hover:z-[1]",
      variants({
        outline: isSelected ? "selected" : undefined,
        over: isActiveHierarchyOverDroppable,
      })
    );

    const Element = ref?.current ? (
      <>{children}</>
    ) : (
      <div
        ref={(el) => {
          setBlockElement(el);
          if (!disable?.drag) {
            sortableRef(el);
          }
        }}
        className={className}
        onClick={onClick}
        data-block-id={blockId}
        data-block-type={blockType}
        data-block-index={index}
        data-block-parent-id={parentBlockId}
        data-block-parent-property={parentProperty}
        data-block-depth={depth}
        data-block-is-overlay={isOverlay}
      >
        {children}
      </div>
    );

    useEffect(() => {
      if (ref?.current) {
        ref.current.addEventListener("click", onClick as any);
        ref.current.classList.add(...className.split(" "));
        return () => {
          ref.current?.removeEventListener("click", onClick as any);
          ref.current?.classList.remove(...className.split(" "));
        };
      }
    }, [ref?.current, onClick, className]);

    return (
      <>
        {Element}
        {!isOverlay && isSelected && !isDragging && (
          <BlockNavPortal
            blockId={blockId}
            blockElement={ref?.current ?? blockElement}
            disable={disable}
          />
        )}
        {!isOverlay && !disable?.drag && isSelected && !isDragging && (
          <BlockHandlerPortal
            blockId={blockId}
            blockElement={ref?.current ?? blockElement}
            isDragging={isDragging}
            handleRef={handleRef}
          />
        )}
      </>
    );
  }
);

export const EditorBlockWrapper: React.FC<TEditorBlockWrapperProps> = memo(
  ({ children, ...rest }) => {
    const blockId = useCurrentBlockId();
    const disable = useCurrentBlockDisableOptions();

    if (disable?.drag) {
      return (
        <NoDragEditorBlockWrapper {...rest}>
          {children}
        </NoDragEditorBlockWrapper>
      );
    }

    return (
      <DragEditorBlockWrapper {...rest}>{children}</DragEditorBlockWrapper>
    );
  }
);

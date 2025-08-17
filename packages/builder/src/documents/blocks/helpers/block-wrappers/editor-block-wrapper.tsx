import React from "react";

import { cva } from "class-variance-authority";

import {
  useCurrentBlock,
  useCurrentBlockId,
  useCurrentBlockIsOverlay,
} from "../../../editor/block";
import {
  useBlockDisableOptions,
  useSelectedBlockId,
  useSetSelectedBlockId,
} from "../../../editor/context";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { BlockNavPortal } from "./block-nav-portal";
import { BlockHandlerPortal } from "./block-handler-portal";

type TEditorBlockWrapperProps = {
  children: React.JSX.Element;
};

export const EditorBlockWrapper: React.FC<TEditorBlockWrapperProps> = ({
  children,
}) => {
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = React.useState(false);
  const [blockElement, setBlockElement] = React.useState<HTMLElement | null>(
    null
  );
  const blockId = useCurrentBlockId();
  const isOverlay = useCurrentBlockIsOverlay();
  const setSelectedBlockId = useSetSelectedBlockId();
  const disable = useBlockDisableOptions(blockId);

  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition,
    isSorting,
    isOver,
  } = useSortable({
    id: blockId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const variants = cva("relative max-w-full outline-offset-1 peer-block", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary !opacity-30",
        false: "!opacity-100",
      },
      over: {
        true: "bg-blue-800/40 bg-opacity-50",
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

  return (
    <>
      <div
        ref={(el) => {
          setBlockElement(el);
          if (!disable?.drag) {
            setNodeRef(el);
          }
        }}
        className={variants({
          outline:
            selectedBlockId === blockId
              ? "selected"
              : mouseInside
                ? "hover"
                : undefined,
          ...(disable?.drag
            ? {}
            : {
                dragging: isOverlay ? "overlay" : isDragging ? "over" : false,
                over: isOver,
                sorting: isSorting,
              }),
        })}
        onMouseEnter={(ev) => {
          setMouseInside(true);
          ev.stopPropagation();
        }}
        onMouseLeave={() => {
          setMouseInside(false);
        }}
        onClick={(ev) => {
          setSelectedBlockId(blockId);
          ev.stopPropagation();
          ev.preventDefault();
        }}
        style={style}
      >
        {children}
      </div>
      {!isOverlay && selectedBlockId === blockId && (
        <BlockNavPortal
          blockId={blockId}
          blockElement={blockElement}
          disable={disable}
        />
      )}
      {!isOverlay && !disable?.drag && selectedBlockId === blockId && (
        <BlockHandlerPortal
          blockElement={blockElement}
          isDragging={isDragging}
          attributes={attributes}
          listeners={listeners}
        />
      )}
    </>
  );
};

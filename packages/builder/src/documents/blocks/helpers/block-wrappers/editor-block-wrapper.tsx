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
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "@vivid/ui";
import { GripVertical } from "lucide-react";
import { NavMenu } from "./nav-menu";
import { useI18n } from "@vivid/i18n";

type TEditorBlockWrapperProps = {
  children: React.JSX.Element;
};

export const EditorBlockWrapper: React.FC<TEditorBlockWrapperProps> = ({
  children,
}) => {
  const selectedBlockId = useSelectedBlockId();
  const [mouseInside, setMouseInside] = React.useState(false);
  const blockId = useCurrentBlockId();
  const isOverlay = useCurrentBlockIsOverlay();
  const setSelectedBlockId = useSetSelectedBlockId();
  const disable = useBlockDisableOptions(blockId);

  const t = useI18n("ui");

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

  const renderHandler = () => {
    if (selectedBlockId !== blockId) {
      return null;
    }

    return (
      <div
        className="absolute top-0 -left-10 rounded-2xl px-1 py-2 z-30 bg-transparent"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                {...attributes}
                {...listeners}
                className={cn(
                  "text-secondary-foreground",
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                )}
              >
                <GripVertical fontSize="small" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">{t("common.move")}</TooltipContent>
          </Tooltip>
        </div>
      </div>
    );
  };

  const renderNav = () => {
    if (selectedBlockId !== blockId) {
      return null;
    }

    return <NavMenu blockId={blockId} disable={disable} />;
  };

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
    <div
      ref={disable?.drag ? undefined : setNodeRef}
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
      {!isOverlay && renderNav()}
      {!isOverlay && !disable?.drag && renderHandler()}
      {children}
    </div>
  );
};

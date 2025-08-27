"use client";

import { useI18n } from "@vivid/i18n";
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "@vivid/ui";
import { GripVertical } from "lucide-react";
import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useBlockIndex, useIsActiveDragBlock } from "../../../editor/context";
import { usePortalContext } from "./portal-context";

interface BlockHandlerPortalProps {
  blockId: string;
  blockElement: HTMLElement | null;
  isDragging: boolean;
}

export const BlockHandlerPortal = forwardRef<
  HTMLButtonElement,
  BlockHandlerPortalProps
>(({ blockId, blockElement, isDragging }, handleRef) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    doNotRender: false,
  });
  const t = useI18n("ui");
  const { body } = usePortalContext();
  const isActiveDragBlock = useIsActiveDragBlock(blockId);
  const index = useBlockIndex(blockId);
  const updatePosition = useCallback(
    (doNotRender: boolean = false) => {
      if (!blockElement) return;

      const rect = blockElement.getBoundingClientRect();
      setPosition({
        top: rect.top,
        left: rect.left - 40, // -left-10 equivalent
        doNotRender,
      });
    },
    [blockElement]
  );

  useEffect(() => {
    if (!blockElement) return;

    updatePosition(true);
    const timeout = setTimeout(() => {
      updatePosition(false);
    }, 300);

    // Update position on scroll and resize
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    // Also listen for scroll events on parent containers
    let parent = blockElement.parentElement;
    while (parent) {
      parent.addEventListener("scroll", handleScroll);
      parent = parent.parentElement;
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);

      // Clean up parent scroll listeners
      parent = blockElement.parentElement;
      while (parent) {
        parent.removeEventListener("scroll", handleScroll);
        parent = parent.parentElement;
      }
    };
  }, [blockElement, isActiveDragBlock, index, updatePosition]);

  if (!blockElement || isActiveDragBlock) return null;

  return createPortal(
    <div
      className="fixed z-50 rounded-2xl px-1 py-2 bg-transparent"
      style={{
        top: position.top,
        left: position.left,
        display: position.doNotRender ? "none" : undefined,
      }}
      onClick={(ev) => ev.stopPropagation()}
    >
      <div className="flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              ref={handleRef}
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
    </div>,
    body
  );
});

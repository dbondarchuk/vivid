"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, cn, Tooltip, TooltipContent, TooltipTrigger } from "@vivid/ui";
import { GripVertical } from "lucide-react";
import { useI18n } from "@vivid/i18n";
import { usePortalContext } from "./portal-context";

interface BlockHandlerPortalProps {
  blockElement: HTMLElement | null;
  isDragging: boolean;
  attributes: any;
  listeners: any;
}

export const BlockHandlerPortal: React.FC<BlockHandlerPortalProps> = ({
  blockElement,
  isDragging,
  attributes,
  listeners,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const t = useI18n("ui");
  const { body } = usePortalContext();

  const updatePosition = React.useCallback(() => {
    if (!blockElement) return;

    const rect = blockElement.getBoundingClientRect();
    setPosition({
      top: rect.top,
      left: rect.left - 40, // -left-10 equivalent
    });
  }, [blockElement]);

  useEffect(() => {
    if (!blockElement) return;

    updatePosition();

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
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);

      // Clean up parent scroll listeners
      parent = blockElement.parentElement;
      while (parent) {
        parent.removeEventListener("scroll", handleScroll);
        parent = parent.parentElement;
      }
    };
  }, [blockElement, updatePosition]);

  if (!blockElement) return null;

  return createPortal(
    <div
      className="fixed z-50 rounded-2xl px-1 py-2 bg-transparent"
      style={{
        top: position.top,
        left: position.left,
      }}
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
    </div>,
    body
  );
};

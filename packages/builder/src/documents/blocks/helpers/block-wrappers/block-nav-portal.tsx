"use client";

import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavMenu } from "./nav-menu";
import { BlockDisableOptions } from "../../../editor/core";
import { usePortalContext } from "./portal-context";
import { useBlockIndex, useIsActiveDragBlock } from "../../../editor/context";
import { useThrottleCallback } from "@vivid/ui";

interface BlockNavPortalProps {
  blockId: string;
  blockElement: HTMLElement | null;
  disable?: BlockDisableOptions;
}

export const BlockNavPortal: React.FC<BlockNavPortalProps> = ({
  blockId,
  blockElement,
  disable,
}) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    doNotRender: false,
  });
  const isActiveDragBlock = useIsActiveDragBlock(blockId);
  const index = useBlockIndex(blockId);
  const { body } = usePortalContext();

  const updatePosition = useCallback(
    (doNotRender: boolean = false) => {
      if (!blockElement) return;

      const rect = blockElement.getBoundingClientRect();
      setPosition({
        top: rect.top - 36, // -top-9 equivalent
        left: rect.left - 2, // -left-0.5 equivalent
        doNotRender,
      });
    },
    [blockElement]
    // 100
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
      className="fixed z-[44] hover:z-[46]"
      style={{
        top: position.top,
        left: position.left,
        display: position.doNotRender ? "none" : undefined,
      }}
    >
      <NavMenu blockId={blockId} disable={disable} />
    </div>,
    body
  );
};

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { NavMenu } from "./nav-menu";
import { BlockDisableOptions } from "../../../editor/core";
import { usePortalContext } from "./portal-context";

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
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { body } = usePortalContext();

  const updatePosition = React.useCallback(() => {
    if (!blockElement) return;

    const rect = blockElement.getBoundingClientRect();
    setPosition({
      top: rect.top - 36, // -top-9 equivalent
      left: rect.left - 2, // -left-0.5 equivalent
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
      className="fixed z-[44] hover:z-[46]"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <NavMenu blockId={blockId} disable={disable} />
    </div>,
    body
  );
};

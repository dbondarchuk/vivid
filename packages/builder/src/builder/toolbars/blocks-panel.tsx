"use client";

import React, { useEffect, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
// import { DragOverlay, useDraggable } from "@dnd-kit/react";
import { cn, ScrollArea } from "@vivid/ui";
import { useBlocks, useRootBlock } from "../../documents/editor/context";
import { generateId } from "../../documents/helpers/block-id";
import { TEditorBlock } from "../../documents/editor/core";
import { BaseZodDictionary } from "../../documents/types";
import { BuilderKeys, useI18n } from "@vivid/i18n";
import { createPortal } from "react-dom";
import { GripVertical } from "lucide-react";

type DraggableBlockItemProps = {
  blockType: string;
  blockConfig: any;
  onDragStart?: () => void;
};

const DraggableBlockItem: React.FC<DraggableBlockItemProps> = ({
  blockType,
  blockConfig,
  onDragStart,
}) => {
  const { isDragging, setNodeRef } = useDraggable({
    id: `template-${blockType}`,
    data: {
      type: "block-template",
      blockType,
      blockConfig,
    },
  });

  const t = useI18n("builder");

  useEffect(() => {
    if (isDragging) {
      onDragStart?.();
    }
  }, [isDragging, onDragStart]);

  return (
    <>
      <div
        ref={setNodeRef}
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-grab active:cursor-grabbing transition-colors",
          isDragging ? "opacity-50" : "!opacity-100"
        )}
      >
        <div className="flex-shrink-0 text-muted-foreground">
          {blockConfig.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {t(blockConfig.displayName as BuilderKeys)}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            {t(blockConfig.category as BuilderKeys)}
          </div>
        </div>
        <div className="flex-shrink-0 text-muted-foreground">
          <GripVertical fontSize="small" />
        </div>
      </div>
      {isDragging && (
        <DragOverlay
          dropAnimation={{
            duration: 500,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
          transition="transform 250ms ease"
        >
          <div className="opacity-50 flex items-center gap-2 p-3 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-grab active:cursor-grabbing transition-colors">
            <div className="flex-shrink-0 text-muted-foreground">
              {blockConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {t(blockConfig.displayName as BuilderKeys)}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {t(blockConfig.category as BuilderKeys)}
              </div>
            </div>
          </div>
        </DragOverlay>
      )}
    </>
  );
};

type BlocksPanelProps<T extends BaseZodDictionary = any> = {
  className?: string;
  allowOnly?: (keyof T)[];
  currentBlockType?: string;
};

export const BlocksPanel = <T extends BaseZodDictionary = any>({
  className,
  allowOnly,
  currentBlockType,
}: BlocksPanelProps<T>) => {
  const blocks = useBlocks();
  const rootBlock = useRootBlock();
  const t = useI18n("builder");

  const filteredBlocks = useMemo(() => {
    return Object.entries(blocks)
      .filter(([type, config]) => {
        // Filter by allowOnly if specified
        if (allowOnly) {
          if (Array.isArray(allowOnly)) {
            if (!allowOnly.includes(type as keyof T)) return false;
          } else {
            if (type !== allowOnly) return false;
          }
        }

        // Don't show root block type
        if (rootBlock.type === type) return false;

        // Check if block is allowed in current block type
        if (currentBlockType && config.allowedIn) {
          if (!config.allowedIn.includes(currentBlockType)) return false;
        }

        return true;
      })
      .reduce(
        (acc, [type, config]) => {
          const category = config.category;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push({ type, config });
          return acc;
        },
        {} as Record<string, Array<{ type: string; config: any }>>
      );
  }, [blocks, allowOnly, currentBlockType, rootBlock.type]);

  const handleBlockDragStart = (blockType: string, blockConfig: any) => {
    // if (onBlockSelect) {
    //   const newBlock: TEditorBlock = {
    //     id: generateId(),
    //     type: blockType,
    //     data:
    //       typeof blockConfig.defaultValue === "function"
    //         ? blockConfig.defaultValue()
    //         : blockConfig.defaultValue,
    //   };
    //   onBlockSelect(newBlock);
    // }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">
          {t("baseBuilder.inspector.configurationPanel.title")}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("baseBuilder.inspector.configurationPanel.clickOnBlockToInspect")}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {Object.entries(filteredBlocks).map(([category, blockList]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {t(category as BuilderKeys)}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {blockList.map(({ type, config }) => (
                  <DraggableBlockItem
                    key={type}
                    blockType={type}
                    blockConfig={config}
                    onDragStart={() => handleBlockDragStart(type, config)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

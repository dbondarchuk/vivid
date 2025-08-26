"use client";

import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
} from "@dnd-kit/react";
import { cn, Tabs, useThrottleCallback } from "@vivid/ui";
import { ComponentProps, useCallback, useState } from "react";
import { PortalProvider } from "../../documents/blocks/helpers/block-wrappers/portal-context";
import {
  useDisableAnimation,
  useDispatchAction,
  useHasActiveDragBlock,
  useSelectedScreenSize,
  useSetActiveDragBlockId,
  useSetActiveOverBlockContextId,
} from "../../documents/editor/context";
import { TEditorBlock } from "../../documents/editor/core";
import { generateId } from "../../documents/helpers/block-id";
import { ReaderDocumentBlocksDictionary } from "../../documents/types";
import { DndContext } from "../../types/dndContext";
import { BlocksSidebar } from "./blocks-sidebar";
import { BlockDragOverlay, Editor } from "./editor";
import { Preview } from "./preview";
import { BuilderToolbar, ViewType } from "./toolbar/builder-toolbar";
import { ViewportEmulator } from "./viewport-emulator";

type TemplatePanelProps = {
  args?: Record<string, any>;
  readerBlocks: ReaderDocumentBlocksDictionary<any>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

const EnableDisableAnimations = ({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) => {
  const hasDragging = useHasActiveDragBlock();
  const disableAnimation = useDisableAnimation();
  return (
    <>
      <style>
        {hasDragging || disableAnimation
          ? `
        * {
          transition: none !important;
          animation: none !important;
        }
      `
          : ""}
      </style>
      {children}
    </>
  );
};

export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  args,
  readerBlocks,
  header,
  footer,
}) => {
  const dispatchAction = useDispatchAction();
  const setActiveDragBlock = useSetActiveDragBlockId();
  const setActiveOverBlock = useSetActiveOverBlockContextId();

  const selectedScreenSize = useSelectedScreenSize();

  const [selectedView, setSelectedView] = useState<ViewType>("editor");
  const [showBlocksPanel, setShowBlocksPanel] = useState(false);

  const onDragStart: ComponentProps<typeof DragDropProvider>["onDragStart"] = (
    event
  ) => {
    const blockId = event.operation.source?.id as string;

    // Handle block template drag (from blocks panel)
    if (blockId.startsWith("template-")) {
      const blockData = event.operation.source?.data;

      if (blockData?.type === "block-template") {
        // Create a new block instance
        const newBlock: TEditorBlock = {
          id: blockData.blockConfig.id || `temp-${Date.now()}`,
          type: blockData.blockType,
          data:
            typeof blockData.blockConfig.defaultValue === "function"
              ? blockData.blockConfig.defaultValue()
              : blockData.blockConfig.defaultValue,
        };

        setActiveDragBlock(newBlock.id, newBlock);
        return;
      }
    }

    setActiveDragBlock(blockId);
  };

  const onDragOver: ComponentProps<typeof DragDropProvider>["onDragOver"] =
    useThrottleCallback(
      (event, manager) => {
        const sourceContext = event.operation.source?.data
          .context as DndContext;
        const targetContext = event.operation.target?.data
          .context as DndContext;
        if (!targetContext) {
          setActiveOverBlock(null);
          return;
        }

        const { dragOperation } = event.operation.source?.manager ?? {};
        if (!dragOperation) {
          setActiveOverBlock(null);
          return;
        }

        const position =
          dragOperation.shape?.current.center ?? dragOperation.position.current;
        const target = event.operation.target;

        const isBelowTarget =
          target?.shape &&
          Math.round(position.y) > Math.round(target.shape.center.y);
        const modifier = isBelowTarget ? 1 : 0;

        const index = targetContext.index + modifier;

        setActiveOverBlock({
          blockId: targetContext.parentBlockId,
          property: targetContext.parentProperty,
          index,
        });

        // setCurrentOverBlock({ id, context: event.operation.target?.data.context });
        // event.preventDefault();
      },
      [setActiveOverBlock],
      50
    );

  const onDragEnd: ComponentProps<typeof DragDropProvider>["onDragEnd"] = (
    event
  ) => {
    setActiveDragBlock(null);
    setActiveOverBlock(null);

    if (event.canceled) return;

    const activeId = event.operation.source?.id as string;
    if (!activeId) return;

    const overId = event.operation.target?.id as string;
    if (!overId) return;

    const sourceContext = event.operation.source?.data.context as DndContext;
    const targetContext = event.operation.target?.data.context as DndContext;

    const sourceManager = event.operation.source?.manager;
    const target = event.operation.target;
    if (!targetContext || !sourceManager || !target) return;

    const { dragOperation } = sourceManager;
    const position =
      dragOperation.shape?.current.center ?? dragOperation.position.current;
    const isBelowTarget =
      target.shape &&
      Math.round(position.y) > Math.round(target.shape.center.y);
    const modifier = isBelowTarget ? 1 : 0;

    let index = targetContext.index + modifier;

    // Handle block template drop

    if (activeId.startsWith("template-")) {
      const blockData = event.operation.source?.data;

      if (blockData?.type === "block-template") {
        const parentBlockId = targetContext.parentBlockId;
        const parentProperty = targetContext.parentProperty;

        const newBlock: TEditorBlock = {
          id: generateId(),
          type: blockData.blockType,
          data:
            typeof blockData.blockConfig.defaultValue === "function"
              ? blockData.blockConfig.defaultValue()
              : blockData.blockConfig.defaultValue,
        };

        dispatchAction({
          type: "add-block",
          value: {
            block: newBlock,
            parentBlockId,
            parentBlockProperty: parentProperty,
            index,
          },
        });

        return;
      }
    }

    // if (
    //   sourceContext.parentBlockId === targetContext.parentBlockId &&
    //   sourceContext.parentProperty === targetContext.parentProperty &&
    //   targetContext.index > sourceContext.index
    // ) {
    //   index = index - 1;
    // }

    // } else {
    dispatchAction({
      type: "move-block",
      value: {
        blockId: activeId,
        parentBlockId: targetContext.parentBlockId,
        parentBlockProperty: targetContext.parentProperty,
        index,
      },
    });
    // }
  };

  const toggleBlocksPanel = useCallback(() => {
    setShowBlocksPanel(!showBlocksPanel);
  }, [showBlocksPanel]);

  return (
    <PortalProvider>
      {/* <ActiveOverblockDebug /> */}
      <Tabs value={selectedView}>
        <BuilderToolbar
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          args={args}
          showBlocksPanel={showBlocksPanel}
          onToggleBlocksPanel={toggleBlocksPanel}
        />

        <div className="flex flex-col justify-center w-full mt-2">
          <DragDropProvider
            sensors={[PointerSensor, KeyboardSensor]}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={(...args) => {
              args[0].preventDefault();
              onDragOver(...args);
            }}
            // plugins={defaultPreset.plugins}
            // collisionDetection={customCollisionDetectionAlgorithm}
          >
            <div className="relative flex h-full">
              {selectedView === "editor" && (
                <>
                  <div
                    className={cn(
                      "w-0 opacity-0 border-r bg-background transition-all",
                      showBlocksPanel && "w-80 opacity-100"
                    )}
                  >
                    <BlocksSidebar className="h-full" />
                  </div>
                  <BlockDragOverlay />
                </>
              )}
              <div className="flex-1">
                <ViewportEmulator viewportSize={selectedScreenSize}>
                  <EnableDisableAnimations>
                    {/* Main Editor Area */}
                    {header}
                    <Editor args={args} readerBlocks={readerBlocks} />
                    <Preview args={args} readerBlocks={readerBlocks} />
                    {footer}
                  </EnableDisableAnimations>
                </ViewportEmulator>
              </div>
            </div>
          </DragDropProvider>
        </div>
      </Tabs>
    </PortalProvider>
  );
};

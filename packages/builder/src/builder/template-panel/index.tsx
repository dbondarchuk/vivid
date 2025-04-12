"use client";

import { EditorBlock } from "../../documents/editor/block";
import {
  useDispatchAction,
  useDocument,
  useSelectedScreenSize,
  useSetActiveDragBlock,
  useSetActiveOverBlock,
} from "../../documents/editor/context";

import {
  CollisionDetection,
  DndContext,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { cn, Tabs, TabsContent } from "@vivid/ui";
import React, { useState } from "react";
import { findBlock, findParentBlock } from "../../documents/helpers/blocks";
import { Reader } from "../../documents/reader/block";
import { ReaderDocumentBlocksDictionary } from "../../documents/types";
import { BuilderToolbar, ViewType } from "./builder-toolbar";

type TemplatePanelProps = {
  args?: Record<string, any>;
  readerBlocks: ReaderDocumentBlocksDictionary<any>;
};

export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  args,
  readerBlocks,
}) => {
  const document = useDocument();

  const dispatchAction = useDispatchAction();
  const setActiveDragBlock = useSetActiveDragBlock();
  const setActiveOverBlock = useSetActiveOverBlock();

  const selectedScreenSize = useSelectedScreenSize();

  const [selectedView, setSelectedView] = useState<ViewType>("editor");

  let mainBoxSx: any = {
    height: "100%",
  };
  if (selectedScreenSize === "mobile") {
    mainBoxSx = {
      ...mainBoxSx,
      margin: "32px auto",
      width: 370,
      height: 800,
      boxShadow:
        "rgba(33, 36, 67, 0.04) 0px 10px 20px, rgba(33, 36, 67, 0.04) 0px 2px 6px, rgba(33, 36, 67, 0.04) 0px 0px 1px",
    };
  }

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    // Press delay of 250ms, with tolerance of 5px of movement
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const onDragStart = (event: DragStartEvent) => {
    const blockId = event.active.id as string;
    const block = findBlock(document, blockId);
    const parentBlockId = findParentBlock(document, blockId)?.id;
    if (!parentBlockId || !block) return;

    setActiveDragBlock({ block, parentBlockId });
  };

  const onDragOver = (event: DragOverEvent) => {
    let id = event.over?.data?.current?.sortable?.containerId as string;
    if (!id) {
      setActiveOverBlock(null);
      return;
    }

    const [blockId, property] = id.split("/", 2);

    setActiveOverBlock({ blockId, property });
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveDragBlock(null);
    setActiveOverBlock(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const activeParent = findParentBlock(document, activeId);
    if (!activeParent) return;

    let overId = over.id as string;
    if (!overId.startsWith("block")) {
      overId = over.data.current?.contextId as string;
      if (!overId) return;

      const [overBlockId, property] = overId.split("/", 2);
      const overParent = findBlock(document, overBlockId);
      if (!overParent) return;

      // const block = deleteBlockInLevel(activeParent, activeId);
      // insertBlockInLevel(overParent, block!, property, 0);

      // setDocument(document);

      dispatchAction({
        type: "move-block",
        value: {
          blockId: activeId,
          parentBlockId: overParent.id,
          parentBlockProperty: property,
          index: 0,
        },
      });

      return;
    }

    const [overBlockId, property] = overId.split("/", 2);
    const overParent = findParentBlock(document, overBlockId);

    if (!activeParent || !overParent) return;
    let activeContainerId = active?.data?.current?.sortable
      ?.containerId as string;

    const activeContainerProperty = activeContainerId?.split("/", 2)?.[1];

    if (
      activeParent.id === overParent.id &&
      activeContainerProperty === property
    ) {
      // swapBlockInLevel(activeParent, activeId, overBlockId);
      // setDocument(document);
      dispatchAction({
        type: "swap-block",
        value: {
          blockId1: activeId,
          blockId2: overBlockId,
        },
      });
    } else {
      const index = over.data.current?.sortable?.index as number;
      if (typeof index === "undefined") return;

      // const block = deleteBlockInLevel(activeParent, activeId);
      // insertBlockInLevel(overParent, block!, property, index);

      // setDocument(document);
      dispatchAction({
        type: "move-block",
        value: {
          blockId: activeId,
          parentBlockId: overParent.id,
          parentBlockProperty: property,
          index,
        },
      });
    }
  };

  const customCollisionDetectionAlgorithm: CollisionDetection = (args) => {
    // First, let's see if there are any collisions with the pointer
    const pointerCollisions = pointerWithin(args);

    // Collision detection algorithms return an array of collisions
    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    // If there are no collisions with the pointer, return rectangle intersections
    return rectIntersection(args);
  };

  return (
    <>
      <Tabs value={selectedView}>
        <BuilderToolbar
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          args={args}
        />

        <div className="flex justify-center w-full">
          <div
            className={cn(selectedScreenSize === "mobile" ? "w-96" : "w-full")}
          >
            <TabsContent value="editor">
              <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
                collisionDetection={customCollisionDetectionAlgorithm}
              >
                <EditorBlock block={document} />
              </DndContext>
            </TabsContent>
            <TabsContent value="preview">
              <Reader
                document={document}
                args={args || {}}
                blocks={readerBlocks}
              />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </>
  );
};

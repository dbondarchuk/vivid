"use client";

import type { CollisionDetection } from "@dnd-kit/core";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  MouseSensor,
  pointerWithin,
  rectIntersection,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Tabs, TabsContent } from "@vivid/ui";
import { useState } from "react";
import { PortalProvider } from "../../documents/blocks/helpers/block-wrappers/portal-context";
import { EditorBlock } from "../../documents/editor/block";
import {
  useDispatchAction,
  useDocument,
  useSelectedScreenSize,
  useSetActiveDragBlock,
  useSetActiveOverBlock,
} from "../../documents/editor/context";
import {
  findBlock,
  findBlockHierarchy,
  findParentBlock,
} from "../../documents/helpers/blocks";
import { Reader } from "../../documents/reader/block";
import { ReaderDocumentBlocksDictionary } from "../../documents/types";
import { BuilderToolbar, ViewType } from "./builder-toolbar";
import { ViewportEmulator } from "./viewport-emulator";

type TemplatePanelProps = {
  args?: Record<string, any>;
  readerBlocks: ReaderDocumentBlocksDictionary<any>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
};

export const TemplatePanel: React.FC<TemplatePanelProps> = ({
  args,
  readerBlocks,
  header,
  footer,
}) => {
  const document = useDocument();

  const dispatchAction = useDispatchAction();
  const setActiveDragBlock = useSetActiveDragBlock();
  const setActiveOverBlock = useSetActiveOverBlock();

  const selectedScreenSize = useSelectedScreenSize();

  const [selectedView, setSelectedView] = useState<ViewType>("editor");

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
    const parent = findParentBlock(document, blockId);
    if (!parent || !block) return;

    const parentBlockId = parent.block.id;
    const parentProperty = parent.property;

    setActiveDragBlock({ block, parentBlockId, parentProperty });
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

    const overId = over.id as string;
    if (!overId.startsWith("block")) {
      const overId = over.data.current?.contextId as string;
      if (!overId) return;

      const [overBlockId, property] = overId.split("/", 2);
      const overParent = findBlock(document, overBlockId);
      if (!overParent) return;

      const hierarchy = findBlockHierarchy(document, overBlockId);
      if (hierarchy && hierarchy.find((block) => block.id === activeId)) {
        console.log("cannot move block inside itself");
        return;
      }

      dispatchAction({
        type: "move-block",
        value: {
          blockId: activeId,
          parentBlockId: overParent.id,
          parentBlockProperty: property,
          index: "last",
        },
      });

      return;
    }

    let [overBlockId, overProperty] = overId.split("/", 2);

    const overParent = findParentBlock(document, overBlockId);
    const dropTarget = overProperty
      ? findBlock(document, overBlockId)
      : overParent?.block;

    const dropTargetProperty = overProperty || overParent?.property;

    if (!activeParent || !dropTarget) return;

    let activeContainerId = active?.data?.current?.sortable
      ?.containerId as string;

    const activeContainerProperty = activeContainerId?.split("/", 2)?.[1];

    if (
      activeParent.block.id === dropTarget.id &&
      activeContainerProperty === dropTargetProperty
    ) {
      dispatchAction({
        type: "swap-block",
        value: {
          blockId1: activeId,
          blockId2: overBlockId,
        },
      });
    } else {
      const index = (over.data.current?.sortable?.index as number) || 0;

      const hierarchy = findBlockHierarchy(document, dropTarget.id);
      if (hierarchy && hierarchy.find((block) => block.id === activeId)) {
        console.log("cannot move block inside itself");
        return;
      }

      dispatchAction({
        type: "move-block",
        value: {
          blockId: activeId,
          parentBlockId: dropTarget.id,
          parentBlockProperty: dropTargetProperty,
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
    <PortalProvider>
      <Tabs value={selectedView}>
        <BuilderToolbar
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          args={args}
        />

        <div className="flex flex-col justify-center w-full mt-2">
          <ViewportEmulator viewportSize={selectedScreenSize}>
            <div className="relative">
              {header}
              <TabsContent value="editor" className="mt-0">
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
              <TabsContent value="preview" className="mt-0">
                <Reader
                  document={document}
                  args={args || {}}
                  blocks={readerBlocks}
                  isEditor
                />
              </TabsContent>
              {footer}
            </div>
          </ViewportEmulator>
        </div>
      </Tabs>
    </PortalProvider>
  );
};

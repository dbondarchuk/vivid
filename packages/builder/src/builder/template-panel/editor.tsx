import { DragOverlay } from "@dnd-kit/react";
import { cn, TabsContent } from "@vivid/ui";
import { memo, useMemo } from "react";
import { EditorBlock } from "../../documents/editor/block";
import {
  useActiveDragBlock,
  useActiveOverBlock,
  useBlock,
  useBlockDepth,
  useRootBlockId,
} from "../../documents/editor/context";

export const ActiveOverblockDebug = () => {
  const activeOverBlock = useActiveOverBlock();
  const block = useBlock(activeOverBlock?.blockId ?? null);
  const depth = useBlockDepth(activeOverBlock?.blockId ?? null);
  return (
    <div className="py-4 px-2 mx-auto w-full bg-red-800 text-white">
      Active Over Block:{" "}
      {block ? (
        <>
          {block.type}, {activeOverBlock?.property}, {activeOverBlock?.index},{" "}
          {depth}
        </>
      ) : (
        <>none</>
      )}
    </div>
  );
};

export const Editor = memo(({ selectedView }: { selectedView: string }) => {
  const rootBlockId = useRootBlockId();

  // We are using forceMount to avoid the editor from being unmounted when the tab is not selected
  // This is because the editor is a large component and we want to avoid the re-rendering of the editor when the tab is not selected
  // This is a workaround to avoid the editor from being unmounted when the tab is not selected
  return (
    <TabsContent
      value="editor"
      className={cn("mt-0", selectedView !== "editor" && "hidden")}
      forceMount
    >
      <EditorBlock
        blockId={rootBlockId}
        index={0}
        parentBlockId={rootBlockId}
        parentProperty="children"
      />
    </TabsContent>
  );
});

export const BlockDragOverlay = memo(() => {
  const activeDragBlock = useActiveDragBlock();

  const dragBlockId = activeDragBlock?.blockId;
  const RenderedBlock = useMemo(() => {
    if (!dragBlockId) return null;

    return (
      <EditorBlock
        blockId={dragBlockId}
        index={0}
        parentBlockId={""}
        parentProperty={""}
        disableClone
        disableDelete
        disableMove
        disableDrag
        isOverlay
      />
    );
  }, [dragBlockId]);

  return <DragOverlay>{RenderedBlock}</DragOverlay>;
});
